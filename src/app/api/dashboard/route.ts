import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, startOfWeek, startOfDay, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const agora = new Date();

    const reservasPorEspaco = await prisma.reserva.groupBy({
      by: ["idEspacoReservado"],
      _count: { idReserva: true },
    });

    const maisUsado = reservasPorEspaco.sort(
      (a, b) => b._count.idReserva - a._count.idReserva
    )[0];

    const espacoInfo = maisUsado
      ? await prisma.espaco.findUnique({
          where: { idEspaco: maisUsado.idEspacoReservado },
        })
      : null;

    const totalReservas = reservasPorEspaco.reduce(
      (acc, r) => acc + r._count.idReserva,
      0
    );

    const percentualOcupacao = maisUsado
      ? Math.round((maisUsado._count.idReserva / totalReservas) * 100)
      : 0;

    const salas = await prisma.sala.findMany({
      include: {
        espacos: {
          include: { reservas: true },
        },
      },
    });

    const salaMaisUsada = salas
      .map((s) => {
        const users = new Set<number>();
        const total = s.espacos.reduce((acc, e) => {
          e.reservas.forEach((r) => users.add(r.idUsuarioCriador));
          return acc + e.reservas.length;
        }, 0);
        return {
          nome: s.nomeSala,
          total,
          totalUsuarios: users.size,
        };
      })
      .sort((a, b) => b.total - a.total)[0];

    const mensal = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfMonth(agora) } },
    });
    const semanal = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfWeek(agora) } },
    });
    const diario = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfDay(agora) } },
    });

    const todas = await prisma.reserva.findMany({
      select: { horaInicio: true },
    });

    const manha = Array(7).fill(0);
    const tarde = Array(7).fill(0);

    todas.forEach((r) => {
      const h = new Date(r.horaInicio).getHours();
      if (h >= 6 && h <= 12) manha[h - 6]++;
      if (h >= 13 && h <= 19) tarde[h - 13]++;
    });

    const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

    const semanaInicio = startOfWeek(agora);
    const semanaFim = endOfWeek(agora);

    const reservasSemana = await prisma.reserva.findMany({
      where: {
        horaInicio: { gte: semanaInicio, lt: semanaFim },
      },
      select: { horaInicio: true, idUsuarioCriador: true },
    });

    const freqMap: Record<string, Set<number>> = {
      DOM: new Set(),
      SEG: new Set(),
      TER: new Set(),
      QUA: new Set(),
      QUI: new Set(),
      SEX: new Set(),
      SAB: new Set(),
    };

    reservasSemana.forEach((r) => {
      const dia = diasSemana[new Date(r.horaInicio).getDay()];
      freqMap[dia].add(r.idUsuarioCriador);
    });

    const frequenciaDias: Record<string, number> = {};
    diasSemana.forEach((d) => {
      frequenciaDias[d] = freqMap[d].size;
    });

    const usuariosReservaramSemana = new Set(
      reservasSemana.map((r) => r.idUsuarioCriador)
    );

    const todosUsuarios = await prisma.usuario.findMany({
      select: { idUsuario: true, nome: true, email: true },
    });

    const inativos = todosUsuarios.filter(
      (u) => !usuariosReservaramSemana.has(u.idUsuario)
    );

    const totalInatividade = inativos.length;

    const topMesRaw = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: { horaInicio: { gte: startOfMonth(agora) } },
      _count: { idReserva: true },
    });

    const topMes = await Promise.all(
      topMesRaw
        .sort((a, b) => b._count.idReserva - a._count.idReserva)
        .slice(0, 3)
        .map(async (t) => {
          const u = await prisma.usuario.findUnique({
            where: { idUsuario: t.idUsuarioCriador },
          });
          return {
            nome: u?.nome ?? "Sem nome",
            email: u?.email ?? "",
            total: t._count.idReserva,
          };
        })
    );

    const topSemanaRaw = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: { horaInicio: { gte: startOfWeek(agora) } },
      _count: { idReserva: true },
    });

    const topSemana = await Promise.all(
      topSemanaRaw
        .sort((a, b) => b._count.idReserva - a._count.idReserva)
        .slice(0, 3)
        .map(async (t) => {
          const u = await prisma.usuario.findUnique({
            where: { idUsuario: t.idUsuarioCriador },
          });
          return {
            nome: u?.nome ?? "Sem nome",
            email: u?.email ?? "",
            total: t._count.idReserva,
          };
        })
    );

    return NextResponse.json({
      espacoMaisUtilizado: espacoInfo?.codigoEspaco ?? "Nenhum",
      percentualOcupacao,
      espacosUtilizados: { mensal, semanal, diario },
      graficos: { manha, tarde },
      frequenciaDias,
      totalInatividade: 0,
      topMes,
      topSemana,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro no dashboard" }, { status: 500 });
  }
}
