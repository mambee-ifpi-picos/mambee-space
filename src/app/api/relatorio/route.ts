import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const filtroSala = (searchParams.get("sala") ?? "").trim();
    const filtroEspaco = (searchParams.get("espaco") ?? "").trim();
    const filtroUsuario = (searchParams.get("usuario") ?? "").trim();
    const inicioParam = searchParams.get("inicio");
    const fimParam = searchParams.get("fim");

    if (!inicioParam || !fimParam) {
      return NextResponse.json({ success: false, error: "Datas obrigatórias" }, { status: 400 });
    }

    const dataFiltroInicio = new Date(inicioParam + "T00:00:00.000Z");
    const dataFiltroFim = new Date(fimParam + "T23:59:59.999Z");

    const reservas = await prisma.reserva.findMany({
      where: {
        situacao: { not: "CANCELADA" },
        horaInicio: {
          gte: dataFiltroInicio,
          lte: dataFiltroFim,
        },
        ...(filtroSala
          ? {
              espaco: {
                sala: {
                  nomeSala: {
                    contains: filtroSala,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {}),
        ...(filtroEspaco
          ? {
              espaco: {
                codigoEspaco: {
                  contains: filtroEspaco,
                  mode: "insensitive",
                },
              },
            }
          : {}),
        ...(filtroUsuario
          ? {
              criador: {
                nome: {
                  contains: filtroUsuario,
                  mode: "insensitive",
                },
              },
            }
          : {}),
      },
      include: {
        criador: true,
        espaco: {
          include: {
            sala: true,
          },
        },
      },
      orderBy: {
        horaInicio: "asc",
      },
    });

    const reservasMapeadas = reservas.map((r: any) => ({
      id: r.idReserva,
      motivo: r.motivo,
      inicio: r.horaInicio.toISOString(),
      fim: r.horaFim.toISOString(),
      usuario: r.criador?.nome || "Sem Nome",
      email: r.criador?.email || "",
      foto: r.criador?.foto || null,
      sala: r.espaco?.sala?.nomeSala || "",
      espaco: r.espaco?.codigoEspaco || "",
    }));

    return NextResponse.json({ success: true, reservas: reservasMapeadas });
  } catch (err: any) {
    console.error("=== ERRO API ===", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
