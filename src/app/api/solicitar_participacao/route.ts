import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- CRIAR SOLICITAÇÃO (OU ENTRADA DIRETA ADMIN) ---
export async function POST(req: Request) {
  try {
    const { idProjeto, idUsuario, motivo, situacaoManual } = await req.json();

    const participacao = await prisma.participa.create({
      data: {
        idProjeto: Number(idProjeto),
        idUsuario: Number(idUsuario),
        motivo,
        situacao: situacaoManual || "Solicitado",
      },
    });

    return NextResponse.json(participacao);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar participação" },
      { status: 500 },
    );
  }
}

// --- ATUALIZAR STATUS (APROVAR OU NEGAR) ---
// Yuri, esse é o método que faltava pra o botão de aceitar funcionar!
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
    return NextResponse.json(
      { error: "Erro ao processar decisão" },
      { status: 500 },
    );
  }
}

// --- REMOVER PARTICIPAÇÃO (ADMIN SAINDO OU REMOVENDO ALGUÉM) ---
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
    return NextResponse.json(
      { error: "Erro ao sair do projeto" },
      { status: 500 },
    );
  }
}
