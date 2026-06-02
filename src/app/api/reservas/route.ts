import { prisma } from "@/lib/prisma";
import { Auth } from "@/lib/supabase/server/Auth";
import type { Prisma } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = Auth(async (req: Request) => {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({ name, value, ...options });
              });
            } catch {}
          },
        },
      },
    );

    const url = new URL(req.url);
    const dataParam = url.searchParams.get("data");
    const idEspacoParam = url.searchParams.get("idEspaco");
    let idUsuarioParam = url.searchParams.get("idUsuario") ?? url.searchParams.get("idUsuarioCriador");
    const pageParam = url.searchParams.get("page");
    const pageSizeParam = url.searchParams.get("pageSize");
    const searchParam = url.searchParams.get("search");

    const idEspaco = idEspacoParam ? Number(idEspacoParam) : undefined;
    const page = pageParam ? Math.max(1, Number(pageParam)) : 1;
    const pageSize = pageSizeParam ? Math.max(1, Math.min(100, Number(pageSizeParam))) : 50;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const emailUsuarioLogado = session?.user?.email;

    let usuarioLogado: { idUsuario: number; admin: boolean; email: string } | undefined;

    if (emailUsuarioLogado) {
      const usuario = await prisma.usuario.findUnique({
        where: { email: emailUsuarioLogado },
        select: { idUsuario: true, admin: true, email: true },
      });
      usuarioLogado = usuario ?? undefined;
    }

    const isAdmin = usuarioLogado?.admin === true;

    if (!isAdmin && !idUsuarioParam && usuarioLogado?.idUsuario && !dataParam && !idEspacoParam) {
      idUsuarioParam = String(usuarioLogado.idUsuario);
    }

    const idUsuario = idUsuarioParam ? Number(idUsuarioParam) : undefined;

    const filters: Prisma.ReservaWhereInput[] = [];

    if (Number.isFinite(idUsuario)) {
      filters.push({
        OR: [{ idUsuarioCriador: idUsuario }, { criador: { idUsuario } }],
      });
    }

    if (Number.isFinite(idEspaco)) {
      filters.push({ espaco: { idEspaco } });
    }

    if (dataParam) {
      const inicio = new Date(`${dataParam}T00:00:00`);
      const fim = new Date(inicio);
      fim.setDate(fim.getDate() + 1);

      filters.push({
        horaInicio: { gte: inicio, lt: fim },
      });
    }

    const where: Prisma.ReservaWhereInput = {
      ...(filters.length > 0 ? { AND: filters } : {}),
      ...(searchParam
        ? {
            criador: {
              nome: {
                contains: searchParam.trim(),
                mode: "insensitive",
              },
            },
          }
        : {}),
    };

    const reservas = await prisma.reserva.findMany({
      where,
      orderBy: { horaInicio: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        espaco: {
          include: {
            sala: true,
          },
        },
        criador: {
          select: { idUsuario: true, nome: true, email: true, foto: true },
        },
      },
    });

    const total = await prisma.reserva.count({ where });

    let totalUsuarioLogado = 0;
    if (usuarioLogado?.idUsuario) {
      totalUsuarioLogado = await prisma.reserva.count({
        where: {
          idUsuarioCriador: usuarioLogado.idUsuario,
          situacao: { not: "CANCELADA" },
        },
      });
    }

    const mappedReservas = reservas.map((r: any) => ({
      ...r,
      Espaco: r.espaco
        ? {
            ...r.espaco,
            Sala: r.espaco.sala,
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      reservas: mappedReservas,
      total,
      totalUsuarioLogado,
      pageSize,
      usuarioLogado,
    });
  } catch (erro) {
    return NextResponse.json(
      {
        success: false,
        error: erro instanceof Error ? erro.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
});

export const POST = Auth(async (req: Request) => {
  try {
    const body = await req.json();
    const { idEspaco, data, inicio, fim, motivo, idUsuario, idCriador } = body;

    if (!idEspaco || !data || !inicio || !fim || !motivo) {
      return NextResponse.json({ success: false, error: "Dados obrigatórios faltando." }, { status: 400 });
    }

    const horaInicio = new Date(`${data}T${inicio}:00`);
    const horaFim = new Date(`${data}T${fim}:00`);

    if (horaInicio >= horaFim) {
      return NextResponse.json(
        {
          success: false,
          error: "Horário inválido.",
        },
        { status: 400 },
      );
    }

    const criadorId = Number(idUsuario ?? idCriador);

    const conflito = await prisma.reserva.findFirst({
      where: {
        idEspacoReservado: Number(idEspaco),
        situacao: "CONFIRMADA",
        horaInicio: { lt: horaFim },
        horaFim: { gt: horaInicio },
      },
    });

    if (conflito) {
      return NextResponse.json(
        {
          success: false,
          error: "Já existe reserva nesse horário.",
        },
        { status: 400 },
      );
    }

    const reserva = await prisma.reserva.create({
      data: {
        motivo: motivo.trim(),
        horaInicio,
        horaFim,
        situacao: "CONFIRMADA",
        espaco: { connect: { idEspaco: Number(idEspaco) } },
        criador: { connect: { idUsuario: criadorId } },
      },
    });

    return NextResponse.json({ success: true, reserva }, { status: 201 });
  } catch (erro) {
    return NextResponse.json(
      {
        success: false,
        error: erro instanceof Error ? erro.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
});

export const DELETE = Auth(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const idReserva = Number(url.searchParams.get("idReserva"));
    const idUsuario = Number(url.searchParams.get("idUsuario"));

    if (!idReserva || !idUsuario) {
      return NextResponse.json(
        {
          success: false,
          error: "idReserva e idUsuario são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const reserva = await prisma.reserva.findUnique({
      where: { idReserva },
      include: { criador: true },
    });

    if (!reserva) {
      return NextResponse.json({ success: false, error: "Reserva não encontrada." }, { status: 404 });
    }

    const solicitante = await prisma.usuario.findUnique({
      where: { idUsuario },
    });

    const isAdmin = solicitante?.admin === true;
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const getVal = (type: string) => parts.find((p) => p.type === type)?.value;

    const agora = new Date(
      `${getVal("year")}-${getVal("month")}-${getVal("day")}T${getVal("hour")}:${getVal("minute")}:${getVal("second")}.000Z`
    );

    if (reserva.horaFim < agora && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Reserva já finalizada não pode ser excluída.",
        },
        { status: 400 },
      );
    }

    const criadorId = reserva.idUsuarioCriador ?? reserva.criador?.idUsuario;

    if (!isAdmin && criadorId !== idUsuario) {
      return NextResponse.json(
        {
          success: false,
          error: "Sem permissão para excluir esta reserva.",
        },
        { status: 403 },
      );
    }

    await prisma.reserva.update({
      where: { idReserva },
      data: { situacao: "CANCELADA" },
    });

    return NextResponse.json({ success: true });
  } catch (erro) {
    return NextResponse.json(
      {
        success: false,
        error: erro instanceof Error ? erro.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
});
