import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idProjeto = parseInt(id);
    const url = new URL(request.url);
    const includeParticipacoes = url.searchParams.get("include") === "participacoes";

    if (isNaN(idProjeto)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const projeto = await prisma.projeto.findUnique({
      where: { idProjeto },
      include: {
        criador: { select: { idUsuario: true, nome: true, foto: true } },
        participacoes: includeParticipacoes
          ? {
              include: {
                usuario: {
                  select: { idUsuario: true, nome: true, foto: true },
                },
              },
              orderBy: { idParticipa: "desc" },
            }
          : false,
      },
    });

    if (!projeto) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });

    const projetoFormatado = {
      ...projeto,
      dataInicio: projeto.dataInicio.toISOString(),
      dataFim: projeto.dataFim ? projeto.dataFim.toISOString() : null,
    };

    return NextResponse.json(projetoFormatado);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, resumo, situacao, dataInicio, dataFim, anexos } = body;
    const startUTC = new Date(`${dataInicio}T12:00:00.000Z`);
    const endUTC = dataFim ? new Date(`${dataFim}T12:00:00.000Z`) : null;

    const projetoAtualizado = await prisma.projeto.update({
      where: { idProjeto: Number(id) },
      data: {
        nome,
        resumo,
        situacao,
        dataInicio: startUTC,
        dataFim: endUTC,
        anexos,
      },
    });
    return NextResponse.json(projetoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    return NextResponse.json({ error: "Erro ao salvar alterações" }, { status: 500 });
  }
}
