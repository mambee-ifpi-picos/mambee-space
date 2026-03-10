import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { idProjeto, idUsuario, motivo, situacaoManual } = await req.json();

    const projId = Number(idProjeto);
    const userId = Number(idUsuario);

    if (isNaN(projId) || isNaN(userId)) {
      return NextResponse.json({ error: "IDs de projeto ou usuário inválidos" }, { status: 400 });
    }

    const participacao = await prisma.participa.create({
      data: {
        motivo,
        situacao: situacaoManual || "Solicitado",
        projeto: { connect: { idProjeto: projId } },
        usuario: { connect: { idUsuario: userId } },
      },
    });

    return NextResponse.json(participacao);
  } catch (error) {
    console.error("ERRO NO POST solicitar_participacao:", error);
    return NextResponse.json({ error: "Erro ao criar participação" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { idParticipa, situacao, motivoSituacao } = await req.json();

    const atualizado = await prisma.participa.update({
      where: { idParticipa: Number(idParticipa) },
      data: {
        situacao,
        motivoSituacao: motivoSituacao || null,
      },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    console.error("ERRO NO PUT:", error);
    return NextResponse.json({ error: "Erro ao processar decisão" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idProjeto = Number(searchParams.get("idProjeto"));
    const idUsuario = Number(searchParams.get("idUsuario"));

    if (!idProjeto || !idUsuario) {
      return NextResponse.json({ error: "IDs faltando" }, { status: 400 });
    }

    await prisma.participa.deleteMany({
      where: {
        idProjeto,
        idUsuario,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json({ error: "Erro ao sair do projeto" }, { status: 500 });
  }
}
