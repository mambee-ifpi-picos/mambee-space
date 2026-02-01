import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idProjeto, idUsuario, motivo } = body;

    // Validação básica
    if (!idProjeto || !idUsuario || !motivo) {
      return NextResponse.json(
        { error: "Dados insuficientes" },
        { status: 400 },
      );
    }

    // 1. Verifica se o cabra já solicitou participação pra não duplicar
    const existente = await prisma.participa.findFirst({
      where: {
        idProjeto: Number(idProjeto),
        idUsuario: Number(idUsuario),
      },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Você já enviou uma solicitação para este projeto." },
        { status: 400 },
      );
    }

    // 2. Cria a nova participação com status 'Solicitado'
    const novaSolicitacao = await prisma.participa.create({
      data: {
        idProjeto: Number(idProjeto),
        idUsuario: Number(idUsuario),
        motivo: motivo,
        situacao: "Solicitado",
      },
    });

    return NextResponse.json(novaSolicitacao, { status: 201 });
  } catch (error) {
    console.error("Erro na API de solicitação:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
