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

export const GET = Auth(async (req: NextRequest, user: User | null) => {
  try {
    console.log("user logado", user);

    const agora = dayjs();

    const ano = agora.year();
    const semana = agora.week();
    const mes = agora.month() + 1;

    const reservas = await prisma.reserva.findMany({
      include: {
        espaco: true,
        criador: true,
      },
    });

    const totalReservas = reservas.length;

    const reservasPorEspaco = await prisma.reserva.groupBy({
      by: ["idEspacoReservado"],
      _count: {
        idReserva: true,
      },
    });

    const maisUsado = reservasPorEspaco.sort(
      (a: CountGroup, b: CountGroup) => b._count.idReserva - a._count.idReserva,
    )[0];

    const espacoInfo =
      maisUsado &&
      (await prisma.espaco.findUnique({
        where: { idEspaco: maisUsado.idEspacoReservado },
      }));

    const maisReservado = espacoInfo
      ? {
          nome: espacoInfo.nome,
          total: maisUsado._count.idReserva,
        }
      : null;

    const firstDay = new Date(Date.UTC(ano, mes - 1, 1));
    const lastDay = new Date(Date.UTC(ano, mes, 0, 23, 59, 59, 999));

    const reservasMes = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: {
        horaInicio: {
          gte: firstDay,
        },
        horaFim: {
          lte: lastDay,
        },
      },
      _count: {
        idReserva: true,
      },
    });

    const topMesRaw = [...reservasMes].sort(
      (a: CountUser, b: CountUser) => b._count.idReserva - a._count.idReserva,
    );

    const top3Mes = await Promise.all(
      topMesRaw.slice(0, 3).map(async (item) => {
        const info = await prisma.usuario.findUnique({
          where: { idUsuario: item.idUsuarioCriador },
        });

        const result: TopUsuario = {
          nome: info?.nome,
          total: item._count.idReserva,
        };

        return result;
      }),
    );

    const reservasSemana = await prisma.reserva.groupBy({
      by: ["idUsuarioCriador"],
      where: {
        horaInicio: {
          gte: agora.startOf("week").toDate(),
          lt: agora.endOf("week").toDate(),
        },
      },
      _count: {
        idReserva: true,
      },
    });

    const topSemanaRaw = [...reservasSemana].sort(
      (a: CountUser, b: CountUser) => b._count.idReserva - a._count.idReserva,
    );

    const top3Semana = await Promise.all(
      topSemanaRaw.slice(0, 3).map(async (item) => {
        const info = await prisma.usuario.findUnique({
          where: { idUsuario: item.idUsuarioCriador },
        });

        const result: TopUsuario = {
          nome: info?.nome,
          total: item._count.idReserva,
        };

        return result;
      }),
    );

    return NextResponse.json({
      totalReservas,
      maisReservado,
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
});
