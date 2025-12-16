/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth } from "@/lib/middleware/Auth";
import { prisma } from "@/lib/prisma";
import type { TopUsuario } from "@/utils/tipos";
import type { User } from "@supabase/supabase-js";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { type NextRequest, NextResponse } from "next/server";

dayjs.extend(weekOfYear);

type CountGroup = {
  idEspacoReservado: number;
  _count: {
    idReserva: number;
  };
};

type CountUser = {
  idUsuarioCriador: number;
  _count: {
    idReserva: number;
  };
};

export const GET = Auth(
  async (_req: NextRequest, user) => {
    try {
      const now = dayjs();
      const [year, month] = [now.year(), now.month() + 1];
      const firstDay = new Date(Date.UTC(year, month - 1, 1));
      const lastDay = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      const [totalReservas, reservasPorEspaco, reservasMes, reservasSemana] =
        await Promise.all([
          prisma.reserva.count(),
          prisma.reserva.groupBy({
            by: ["idEspacoReservado"],
            _count: { idReserva: true },
          }),
          prisma.reserva.groupBy({
            by: ["idUsuarioCriador"],
            where: { horaInicio: { gte: firstDay }, horaFim: { lte: lastDay } },
            _count: { idReserva: true },
          }),
          prisma.reserva.groupBy({
            by: ["idUsuarioCriador"],
            where: {
              horaInicio: {
                gte: now.startOf("week").toDate(),
                lt: now.endOf("week").toDate(),
              },
            },
            _count: { idReserva: true },
          }),
        ]);

      // Most used space
      const maisUsado = reservasPorEspaco.sort(
        (a, b) => b._count.idReserva - a._count.idReserva,
      )[0];
      const espacoInfo = maisUsado
        ? await prisma.espaco.findUnique({
            where: { idEspaco: maisUsado.idEspacoReservado },
          })
        : null;

      // Top 3 users of the month
      const topMesRaw = reservasMes
        .sort((a, b) => b._count.idReserva - a._count.idReserva)
        .slice(0, 3);
      const topMesIds = topMesRaw.map((r) => r.idUsuarioCriador);
      const topMesUsers = await prisma.usuario.findMany({
        where: { idUsuario: { in: topMesIds } },
        select: { idUsuario: true, nome: true },
      });

      const top3Mes = topMesRaw.map((r) => ({
        nome:
          topMesUsers.find((u) => u.idUsuario === r.idUsuarioCriador)?.nome ??
          "Desconhecido",
        total: r._count.idReserva,
      }));

      // Top 3 users of the week
      const topSemanaRaw = reservasSemana
        .sort((a, b) => b._count.idReserva - a._count.idReserva)
        .slice(0, 3);
      const topSemanaIds = topSemanaRaw.map((r) => r.idUsuarioCriador);
      const topSemanaUsers = await prisma.usuario.findMany({
        where: { idUsuario: { in: topSemanaIds } },
        select: { idUsuario: true, nome: true },
      });

      const top3Semana = topSemanaRaw.map((r) => ({
        nome:
          topSemanaUsers.find((u) => u.idUsuario === r.idUsuarioCriador)
            ?.nome ?? "Desconhecido",
        total: r._count.idReserva,
      }));

      return NextResponse.json({
        totalReservas,
        maisReservado: espacoInfo
          ? { nome: espacoInfo.nome, total: maisUsado._count.idReserva }
          : null,
        topMes: top3Mes,
        topSemana: top3Semana,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao buscar dados" },
        { status: 500 },
      );
    }
  },
  { required: true },
);
