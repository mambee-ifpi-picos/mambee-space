import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: Request) {
  try {
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

    const hoje = new Date(
      `${getVal("year")}-${getVal("month")}-${getVal("day")}T${getVal("hour")}:${getVal("minute")}:${getVal("second")}.000Z`
    );
    const depois24 = new Date(hoje.getTime() + 1000 * 60 * 60 * 24);

    const reservas = await prisma.reserva.findMany({
      where: {
        situacao: { not: "CANCELADA" },
        horaFim: { gte: hoje },
        horaInicio: { lte: depois24 },
      },
      include: {
        criador: {
          select: {
            nome: true,
            email: true,
            foto: true,
          },
        },
        espaco: {
          select: {
            codigoEspaco: true,
            sala: {
              select: {
                nomeSala: true,
              },
            },
          },
        },
      },
      orderBy: {
        horaInicio: "asc",
      },
    });

    const mappedReservas = reservas.map((r: any) => ({
      idReserva: r.idReserva,
      motivo: r.motivo,
      horaInicio: r.horaInicio.toISOString(),
      horaFim: r.horaFim.toISOString(),
      situacao: r.situacao,
      Usuario: r.criador
        ? {
            nome: r.criador.nome,
            email: r.criador.email,
            foto: r.criador.foto,
          }
        : undefined,
      Espaco: r.espaco
        ? {
            codigoEspaco: r.espaco.codigoEspaco,
            Sala: r.espaco.sala
              ? {
                  nomeSala: r.espaco.sala.nomeSala,
                }
              : undefined,
          }
        : undefined,
    }));

    return NextResponse.json({
      success: true,
      total: mappedReservas.length,
      reservas: mappedReservas,
    });
  } catch (error: unknown) {
    console.error("ERRO AO GERAR RELATÓRIO:", error);
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
