import { prisma } from "@/lib/prisma";
import { Auth } from "@/lib/supabase/server/Auth";
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

type UsuarioInfo = {
  idUsuario: number;
  nome: string | null;
};

export const GET = Auth(
  async (_req: NextRequest, user: User | null) => {
    try {
      if (!user) {
        return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
      }

      const now = dayjs();
      const [year, month] = [now.year(), now.month() + 1];
      const firstDay = new Date(Date.UTC(year, month - 1, 1));
      const lastDay = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      try {
        await prisma.$queryRaw`SELECT 1`;
      } catch {
        return NextResponse.json({ error: "Servidor de banco de dados indisponível" }, { status: 503 });
      }

      const usuario = await prisma.usuario.findFirst({
        where: {
          OR: [{ email: user.email }, { idAuth: user.id }],
        },
        select: {
          idUsuario: true,
          nome: true,
          email: true,
        },
      });

      if (!usuario) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
      }

      const [totalReservasUsuario, reservasMesUsuario, reservasSemanaUsuario] = await Promise.all([
        prisma.reserva.count({
          where: { idUsuarioCriador: usuario.idUsuario, situacao: { not: "CANCELADA" } },
        }),
        prisma.reserva.count({
          where: {
            idUsuarioCriador: usuario.idUsuario,
            situacao: { not: "CANCELADA" },
            horaInicio: { gte: firstDay },
            horaFim: { lte: lastDay },
          },
        }),
        prisma.reserva.count({
          where: {
            idUsuarioCriador: usuario.idUsuario,
            situacao: { not: "CANCELADA" },
            horaInicio: {
              gte: now.startOf("week").toDate(),
              lt: now.endOf("week").toDate(),
            },
          },
        }),
      ]);

      let totalReservasGeral = 0;
      let reservasPorEspaco: CountGroup[] = [];
      let reservasMes: CountUser[] = [];
      let reservasSemana: CountUser[] = [];

      [totalReservasGeral, reservasPorEspaco, reservasMes, reservasSemana] = await Promise.all([
        prisma.reserva.count({
          where: { situacao: { not: "CANCELADA" } },
        }),
        prisma.reserva.groupBy({
          by: ["idEspacoReservado"],
          where: { situacao: { not: "CANCELADA" } },
          _count: { idReserva: true },
        }),
        prisma.reserva.groupBy({
          by: ["idUsuarioCriador"],
          where: {
            situacao: { not: "CANCELADA" },
            horaInicio: { gte: firstDay },
            horaFim: { lte: lastDay },
          },
          _count: { idReserva: true },
        }),
        prisma.reserva.groupBy({
          by: ["idUsuarioCriador"],
          where: {
            situacao: { not: "CANCELADA" },
            horaInicio: {
              gte: now.startOf("week").toDate(),
              lt: now.endOf("week").toDate(),
            },
          },
          _count: { idReserva: true },
        }),
      ]);

      let espacoMaisUtilizado = "Nenhum";
      if (reservasPorEspaco.length > 0) {
        const maisUsado = reservasPorEspaco.sort((a, b) => b._count.idReserva - a._count.idReserva)[0];

        const espacoInfo = await prisma.espaco.findUnique({
          where: { idEspaco: maisUsado.idEspacoReservado },
        });

        espacoMaisUtilizado = espacoInfo?.nome ?? "Desconhecido";
      }

      const topMes = await processarTopUsuarios(reservasMes);
      const topSemana = await processarTopUsuarios(reservasSemana);

      const [totalEspacos, espacosComReservasMes, espacosComReservasSemana, espacosComReservasHoje] = await Promise.all(
        [
          prisma.espaco.count(),
          prisma.reserva.groupBy({
            by: ["idEspacoReservado"],
            where: {
              situacao: { not: "CANCELADA" },
              horaInicio: { gte: firstDay },
              horaFim: { lte: lastDay },
            },
          }),
          prisma.reserva.groupBy({
            by: ["idEspacoReservado"],
            where: {
              situacao: { not: "CANCELADA" },
              horaInicio: { gte: now.startOf("week").toDate() },
              horaFim: { lte: now.endOf("week").toDate() },
            },
          }),
          prisma.reserva.groupBy({
            by: ["idEspacoReservado"],
            where: {
              situacao: { not: "CANCELADA" },
              horaInicio: { gte: now.startOf("day").toDate() },
              horaFim: { lt: now.add(1, "day").startOf("day").toDate() },
            },
          }),
        ],
      );

      const frequenciaDiasMap: Record<string, number> = {};
      const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

      const frequenciaDias = await prisma.$queryRaw<Array<{ dia_semana: number; total: bigint }>>`
        SELECT 
          EXTRACT(DOW FROM "horaInicio") as dia_semana,
          COUNT(*) as total
        FROM "Reserva"
        WHERE "situacao" <> 'CANCELADA'
        GROUP BY EXTRACT(DOW FROM "horaInicio")
      `;

      frequenciaDias.forEach((d: { dia_semana: any; total: any }) => {
        const diaIndex = Number(d.dia_semana);
        frequenciaDiasMap[dias[diaIndex]] = Number(d.total);
      });

      const horariosManha = Array(6).fill(0);
      const horariosTarde = Array(11).fill(0);

      const horariosAgrupados = await prisma.$queryRaw<Array<{ hora: number; total: bigint }>>`
        SELECT 
          EXTRACT(HOUR FROM "horaInicio") as hora,
          COUNT(*) as total
        FROM "Reserva"
        WHERE "situacao" <> 'CANCELADA'
          AND EXTRACT(HOUR FROM "horaInicio") BETWEEN 6 AND 23
          AND EXTRACT(HOUR FROM "horaInicio") <> 12
        GROUP BY EXTRACT(HOUR FROM "horaInicio")
      `;

      horariosAgrupados.forEach((h: { hora: any; total: any }) => {
        const hora = Number(h.hora);
        const total = Number(h.total);

        if (hora >= 6 && hora < 12) horariosManha[hora - 6] = total;
        if (hora >= 13 && hora < 24) horariosTarde[hora - 13] = total;
      });

      const [totalUsuarios, usuariosComReserva] = await Promise.all([
        prisma.usuario.count(),
        prisma.reserva.findMany({
          where: { situacao: { not: "CANCELADA" } },
          select: { idUsuarioCriador: true },
          distinct: ["idUsuarioCriador"],
        }),
      ]);

      const totalInatividade = Math.max(totalUsuarios - usuariosComReserva.length, 0);

      const espacosUtilizados = {
        mensal: totalEspacos ? Math.round((espacosComReservasMes.length / totalEspacos) * 100) : 0,
        semanal: totalEspacos ? Math.round((espacosComReservasSemana.length / totalEspacos) * 100) : 0,
        diario: totalEspacos ? Math.round((espacosComReservasHoje.length / totalEspacos) * 100) : 0,
      };

      return NextResponse.json({
        usuario: {
          id: usuario.idUsuario,
          nome: usuario.nome,
          email: usuario.email,
          totalReservas: totalReservasUsuario,
          reservasMes: reservasMesUsuario,
          reservasSemana: reservasSemanaUsuario,
        },

        totalReservas: totalReservasGeral,
        espacoMaisUtilizado,
        espacosUtilizados,

        graficos: {
          manha: horariosManha,
          tarde: horariosTarde,
        },

        frequenciaDias: frequenciaDiasMap,
        totalInatividade,
        totalAtividade: usuariosComReserva.length,
        topMes: topMes.slice(0, 3),
        topSemana: topSemana.slice(0, 3),
      });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao buscar dados do dashboard" }, { status: 500 });
    }
  },
  { required: true },
);

async function processarTopUsuarios(topRaw: CountUser[]): Promise<Array<{ nome: string; total: number }>> {
  if (!topRaw.length) return [];

  const topOrdenado = topRaw.sort((a, b) => b._count.idReserva - a._count.idReserva).slice(0, 5);

  const ids = topOrdenado.map((r) => r.idUsuarioCriador);

  const usuarios = await prisma.usuario.findMany({
    where: { idUsuario: { in: ids } },
    select: { idUsuario: true, nome: true },
  });

  return topOrdenado.map((r) => ({
    nome: usuarios.find((u: { idUsuario: number }) => u.idUsuario === r.idUsuarioCriador)?.nome ?? "Desconhecido",
    total: r._count.idReserva,
  }));
}
