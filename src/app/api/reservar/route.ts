import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Buscar Salas, Espaços e Cronograma
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo");
  const idSala = searchParams.get("idSala");
  const idEspaco = searchParams.get("idEspaco");
  const data = searchParams.get("data");

  try {
    // 1. Salas
    if (tipo === "salas") {
      const salas = await prisma.sala.findMany({
        where: { ativa: true },
        select: {
          idSala: true,
          nomeSala: true,
          mapa: true,
          limiteHorasReserva: true,
        },
        orderBy: { nomeSala: "asc" },
      });
      return NextResponse.json(salas);
    }

    // 2. Espaços
    if (tipo === "espacos" && idSala) {
      const espacos = await prisma.espaco.findMany({
        where: { idSalaPertence: Number(idSala) },
        select: { idEspaco: true, codigoEspaco: true },
        orderBy: { codigoEspaco: "asc" },
      });
      return NextResponse.json(espacos);
    }

    // 3. Cronograma (Filtrado por dia e espaço)
    if (idEspaco && data) {
      const inicioDia = new Date(`${data}T00:00:00.000Z`);
      const fimDia = new Date(`${data}T23:59:59.999Z`);

      const reservas = await prisma.reserva.findMany({
        where: {
          idEspacoReservado: Number(idEspaco),
          situacao: "ATIVO",
          AND: [
            { horaInicio: { gte: inicioDia } },
            { horaInicio: { lte: fimDia } },
          ],
        },
        select: {
          idReserva: true,
          horaInicio: true,
          horaFim: true,
          motivo: true,
          criador: { select: { nome: true, foto: true } },
        },
        orderBy: { horaInicio: "asc" },
      });
      return NextResponse.json(reservas);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Erro API GET:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST: Criar Reserva
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      idEspaco,
      data,
      horaInicio,
      horaFim,
      motivo,
      idUsuarioSupabase,
      emailUsuario,
    } = body;

    // Validações básicas
    if (!horaInicio || !horaFim)
      return NextResponse.json(
        { error: "Horários obrigatórios!" },
        { status: 400 }
      );

    const inicio = new Date(`${data}T${horaInicio}:00.000Z`);
    const fim = new Date(`${data}T${horaFim}:00.000Z`);
    const hoje = new Date();
    hoje.setUTCHours(0, 0, 0, 0);
    const diaReserva = new Date(`${data}T00:00:00.000Z`);

    if (diaReserva < hoje)
      return NextResponse.json(
        { error: "Data passada não pode." },
        { status: 400 }
      );
    if (inicio >= fim)
      return NextResponse.json(
        { error: "Hora final deve ser maior que a inicial." },
        { status: 400 }
      );
    if (!idUsuarioSupabase)
      return NextResponse.json(
        { error: "Usuário não identificado." },
        { status: 401 }
      );

    // Busca ou cria usuário local vinculado ao Supabase
    let usuarioReal = await prisma.usuario.findUnique({
      where: { idAuth: idUsuarioSupabase },
    });

    if (!usuarioReal && emailUsuario) {
      const usuarioPorEmail = await prisma.usuario.findUnique({
        where: { email: emailUsuario },
      });
      if (usuarioPorEmail) {
        usuarioReal = await prisma.usuario.update({
          where: { email: emailUsuario },
          data: { idAuth: idUsuarioSupabase },
        });
      } else {
        usuarioReal = await prisma.usuario.create({
          data: {
            email: emailUsuario,
            idAuth: idUsuarioSupabase,
            nome: emailUsuario.split("@")[0],
            admin: false,
          },
        });
      }
    }

    if (!usuarioReal)
      return NextResponse.json(
        { error: "Erro: Usuário não encontrado." },
        { status: 404 }
      );

    // Validação de limite de horas da sala
    const espacoInfo = await prisma.espaco.findUnique({
      where: { idEspaco: Number(idEspaco) },
      include: { sala: true },
    });

    if (espacoInfo) {
      const diffHoras = (fim.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      if (diffHoras > espacoInfo.sala.limiteHorasReserva) {
        return NextResponse.json(
          {
            error: `Tempo excedido! Limite: ${espacoInfo.sala.limiteHorasReserva}h.`,
          },
          { status: 400 }
        );
      }
    }

    // Verificação de conflito de horário
    const conflito = await prisma.reserva.findFirst({
      where: {
        idEspacoReservado: Number(idEspaco),
        situacao: "ATIVO",
        OR: [
          {
            AND: [{ horaInicio: { lte: inicio } }, { horaFim: { gt: inicio } }],
          },
          { AND: [{ horaInicio: { lt: fim } }, { horaFim: { gte: fim } }] },
          { AND: [{ horaInicio: { gte: inicio } }, { horaFim: { lte: fim } }] },
        ],
      },
    });
    if (conflito)
      return NextResponse.json(
        { error: "Já existe reserva neste horário!" },
        { status: 409 }
      );

    // Criação da reserva
    const novaReserva = await prisma.reserva.create({
      data: {
        motivo,
        horaInicio: inicio,
        horaFim: fim,
        situacao: "ATIVO",
        idUsuarioCriador: usuarioReal.idUsuario,
        idEspacoReservado: Number(idEspaco),
      },
    });

    return NextResponse.json(novaReserva, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
