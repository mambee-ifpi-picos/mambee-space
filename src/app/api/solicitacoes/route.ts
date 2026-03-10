import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { idParticipa, novaSituacao, motivoSituacao } = body;

    if (!idParticipa || !novaSituacao) {
      return NextResponse.json({ error: "ID da participação ou nova situação não informados." }, { status: 400 });
    }

    const participacaoAtualizada = await prisma.participa.update({
      where: {
        idParticipa: Number(idParticipa),
      },
      data: {
        situacao: novaSituacao,
        motivoSituacao: motivoSituacao || null,
      },
    });

    return NextResponse.json(participacaoAtualizada, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar solicitação:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Solicitação não encontrada no banco." }, { status: 404 });
    }

    return NextResponse.json({ error: "Erro interno ao salvar decisão." }, { status: 500 });
  }
}
