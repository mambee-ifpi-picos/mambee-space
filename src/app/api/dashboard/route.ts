import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, startOfWeek, startOfDay, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const agora = new Date();

    // --- ESPAÇO MAIS UTILIZADO ---
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

    // --- SALA MAIS UTILIZADA ---
    const salas = await prisma.sala.findMany({
      include: {
        espacos: {
          include: {
            reservas: true,
          },
        },
      },
    });

    const salaMaisUsada = salas
      .map((s) => {
        const usuariosUnicos = new Set<number>();
        s.espacos.forEach((e) =>
          e.reservas.forEach((r) => usuariosUnicos.add(r.idUsuarioCriador))
        );
        const totalReservasSala = s.espacos.reduce(
          (acc, e) => acc + e.reservas.length,
          0
        );
        return {
          nome: s.nomeSala,
          total: totalReservasSala,
          totalUsuarios: usuariosUnicos.size,
        };
      })
      .sort((a, b) => b.total - a.total)[0];

    // --- USO MENSAL / SEMANAL / DIÁRIO ---
    const mensal = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfMonth(agora) } },
    });

    const semanal = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfWeek(agora) } },
    });

    const diario = await prisma.reserva.count({
      where: { horaInicio: { gte: startOfDay(agora) } },
    });

    // --- HORÁRIO MAIS UTILIZADO ---
    const horas = await prisma.reserva.groupBy({
      by: ["horaInicio"],
      _count: { idReserva: true },
    });

    let horarioMaisUsado = "Nenhum";
    if (horas.length > 0) {
      const hSorted = horas.sort(
        (a, b) => b._count.idReserva - a._count.idReserva
      )[0];
      horarioMaisUsado = new Date(hSorted.horaInicio).toLocaleTimeString(
        "pt-BR",
        { hour: "2-digit", minute: "2-digit" }
      );
    }

    // --- FREQUÊNCIA POR DIA DA SEMANA (USUÁRIOS ÚNICOS) ---
    const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];
    const semanaInicio = startOfWeek(agora);
    const semanaFim = endOfWeek(agora);

    const reservasSemana = await prisma.reserva.findMany({
      where: {
        horaInicio: { gte: semanaInicio, lt: semanaFim },
      },
      select: { horaInicio: true, idUsuarioCriador: true },
    });

    const usuariosPorDia: Record<string, Set<number>> = {
      DOM: new Set(),
      SEG: new Set(),
      TER: new Set(),
      QUA: new Set(),
      QUI: new Set(),
      SEX: new Set(),
      SAB: new Set(),
    };

    reservasSemana.forEach((r) => {
      const dia = diasSemana[r.horaInicio.getDay()];
      usuariosPorDia[dia].add(r.idUsuarioCriador);
    });

    const freq: Record<string, number> = {};
    diasSemana.forEach((dia) => {
      freq[dia] = usuariosPorDia[dia].size;
    });

    // --- INATIVIDADE ---
    const totalInatividade = await prisma.reserva.count({
      where: { horaInicio: { lt: startOfWeek(agora) } },
    });

    // --- TOP USUÁRIOS DO MÊS ---
    const topMesRaw = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: { horaInicio: { gte: startOfMonth(agora) } },
      _count: { idReserva: true },
    });

    const topMesOrd = topMesRaw.sort(
      (a, b) => b._count.idReserva - a._count.idReserva
    );

    const topMes = await Promise.all(
      topMesOrd.slice(0, 3).map(async (t) => {
        const user = await prisma.usuario.findUnique({
          where: { idUsuario: t.idUsuarioCriador },
        });
        return {
          nome: user?.nome ?? "Sem nome",
          email: user?.email ?? "",
          total: t._count.idReserva,
        };
      })
    );

    // --- TOP USUÁRIOS DA SEMANA ---
    const topSemanaRaw = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: { horaInicio: { gte: startOfWeek(agora) } },
      _count: { idReserva: true },
    });

    const topSemanaOrd = topSemanaRaw.sort(
      (a, b) => b._count.idReserva - a._count.idReserva
    );

    const topSemana = await Promise.all(
      topSemanaOrd.slice(0, 3).map(async (t) => {
        const user = await prisma.usuario.findUnique({
          where: { idUsuario: t.idUsuarioCriador },
        });
        return {
          nome: user?.nome ?? "Sem nome",
          email: user?.email ?? "",
          total: t._count.idReserva,
        };
      })
    );

    // --- RETORNO FINAL ---
    return NextResponse.json({
      espacoMaisUtilizado: espacoInfo?.codigoEspaco ?? "Nenhum",
      percentualOcupacao,
      salaMaisUsada: salaMaisUsada?.nome ?? "Nenhuma",
      totalUsuariosSala: salaMaisUsada?.totalUsuarios ?? 0,
      espacosUtilizados: { mensal, semanal, diario },
      horarioMaisUsado,
      frequenciaDias: freq,
      totalInatividade,
      topMes,
      topSemana,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro no dashboard" }, { status: 500 });
  }
}
