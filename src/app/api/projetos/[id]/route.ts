import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const idProjeto = parseInt(params.id);

    if (isNaN(idProjeto)) {
      return NextResponse.json({ error: "ID do projeto inválido" }, { status: 400 });
    }

    const projeto = await prisma.projeto.findUnique({
      where: { idProjeto },
      include: {
        criador: {
          select: { nome: true, foto: true },
        },
      },
    });

    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(projeto);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
