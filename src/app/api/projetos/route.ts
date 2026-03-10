import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projetos = await prisma.projeto.findMany({
      orderBy: [
        { situacao: "asc" },
        { nome: "asc" },
      ],
      include: {
        criador: { select: { nome: true } },
        participacoes: {
          select: { idUsuario: true, situacao: true },
        },
      },
    });

    return NextResponse.json(projetos);
  } catch (error) {
    console.error("ERRO GET API:", error);
    return NextResponse.json({ success: false, error: "Erro ao buscar projetos no banco" }, { status: 500 });
  }
}
