import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const url = new URL(req.url);
    const dataParam = url.searchParams.get("data");
    const idEspacoParam = url.searchParams.get("idEspaco");
    let idUsuarioParam =
      url.searchParams.get("idUsuario") ??
      url.searchParams.get("idUsuarioCriador");
    const pageParam = url.searchParams.get("page");
    const pageSizeParam = url.searchParams.get("pageSize");
    const searchParam = url.searchParams.get("search");

    const idEspaco = idEspacoParam ? Number(idEspacoParam) : undefined;
    const page = pageParam ? Math.max(1, Number(pageParam)) : 1;
    const pageSize = pageSizeParam
      ? Math.max(1, Math.min(100, Number(pageSizeParam)))
      : 50;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const emailUsuarioLogado = session?.user?.email;

    let usuarioLogado:
      | { idUsuario: number; admin: boolean; email: string }
      | undefined;

    if (emailUsuarioLogado) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: emailUsuarioLogado },
        select: { idUsuario: true, admin: true, email: true },
      });
      usuarioLogado = usuario ?? undefined;
    }

    const isAdmin = usuarioLogado?.admin === true;

    if (
      !isAdmin &&
      !idUsuarioParam &&
      usuarioLogado?.idUsuario &&
      !dataParam &&
      !idEspacoParam
    ) {
      idUsuarioParam = String(usuarioLogado.idUsuario);
    }

    const idUsuario = idUsuarioParam ? Number(idUsuarioParam) : undefined;

    const filters: Prisma.ReservaWhereInput[] = [];

    if (typeof idUsuario === "number" && Number.isFinite(idUsuario)) {
      filters.push({
        OR: [{ idUsuarioCriador: idUsuario }, { criador: { idUsuario } }],
      });
    }

    if (typeof idEspaco === "number" && Number.isFinite(idEspaco)) {
      filters.push({ espaco: { idEspaco } });
    }

    if (dataParam && dataParam.trim().length > 0) {
      const dataInicioUTC = new Date(`${dataParam}T00:00:00.000Z`);
      const dataFimExclusivo = new Date(dataInicioUTC);
      dataFimExclusivo.setDate(dataFimExclusivo.getDate() + 1);

      filters.push({
        horaInicio: { gte: dataInicioUTC, lt: dataFimExclusivo },
      });
    }

    if (searchParam && searchParam.trim().length > 0) {
      filters.push({
        motivo: { contains: searchParam.trim(), mode: "insensitive" },
      });
    }

    const whereClause = filters.length > 0 ? { AND: filters } : undefined;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const reservas = await prisma.reserva.findMany({
      where: whereClause,
      orderBy: { horaInicio: "asc" },
      skip,
      take,
      include: {
        espaco: true,
        criador: {
          select: { idUsuario: true, email: true, nome: true, foto: true },
        },
      },
    });

    const total = await prisma.reserva.count({ where: whereClause });

    return NextResponse.json({
      success: true,
      reservas,
      total,
      usuarioLogado: usuarioLogado
        ? {
            idUsuario: usuarioLogado.idUsuario,
            admin: usuarioLogado.admin,
            email: usuarioLogado.email,
          }
        : null,
      pageSize,
    });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
    return NextResponse.json(
      { success: false, error: mensagem },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idEspaco, data, inicio, fim, motivo, idUsuario, idCriador } = body;

    if (
      !idEspaco ||
      !data ||
      !inicio ||
      !fim ||
      !motivo ||
      (!idUsuario && !idCriador)
    ) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios faltando." },
        { status: 400 }
      );
    }

    const horaInicio = new Date(`${data}T${inicio}:00.000Z`);
    const horaFim = new Date(`${data}T${fim}:00.000Z`);
    if (
      Number.isNaN(horaInicio.getTime()) ||
      Number.isNaN(horaFim.getTime()) ||
      horaInicio >= horaFim
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Horário de início ou fim inválido/inconsistente.",
        },
        { status: 400 }
      );
    }

    const criadorId = Number(idUsuario ?? idCriador);

    const novaReserva = await prisma.reserva.create({
      data: {
        motivo: motivo.trim(),
        horaInicio,
        horaFim,
        situacao: "CONFIRMADA",
        espaco: { connect: { idEspaco: Number(idEspaco) } },
        criador: { connect: { idUsuario: criadorId } },
      },
    });

    return NextResponse.json(
      { success: true, reserva: novaReserva },
      { status: 201 }
    );
  } catch (erro) {
    const mensagem =
      erro instanceof Error
        ? erro.message
        : "Erro desconhecido ao processar reserva";
    return NextResponse.json(
      { success: false, error: mensagem },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    const emailUsuarioLogado = session.user.email;
    const solicitante = await prisma.usuario.findUnique({
      where: { email: emailUsuarioLogado },
    });

    if (!solicitante) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário solicitante não encontrado no banco de dados.",
        },
        { status: 404 }
      );
    }

    const url = new URL(req.url);
    const idReservaParam = url.searchParams.get("idReserva");
    if (!idReservaParam) {
      return NextResponse.json(
        { success: false, error: "Parâmetro idReserva necessário." },
        { status: 400 }
      );
    }

    const idReserva = Number(idReservaParam);
    const reserva = await prisma.reserva.findUnique({
      where: { idReserva },
      include: { criador: true },
    });
    if (!reserva) {
      return NextResponse.json(
        { success: false, error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

    const solicitanteIsAdmin = solicitante.admin === true;
    const reservaCriadorId =
      reserva.idUsuarioCriador ?? reserva.criador?.idUsuario ?? null;
    const ehCriador = reservaCriadorId === solicitante.idUsuario;

    if (!solicitanteIsAdmin && !ehCriador) {
      return NextResponse.json(
        { success: false, error: "Não autorizado para apagar esta reserva." },
        { status: 403 }
      );
    }

    await prisma.reserva.delete({ where: { idReserva } });
    return NextResponse.json({ success: true });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido";
    return NextResponse.json(
      { success: false, error: mensagem },
      { status: 500 }
    );
  }
}
