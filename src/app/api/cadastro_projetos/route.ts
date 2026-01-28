import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

export async function GET() {
  try {
    const projetos = await prisma.projeto.findMany({
      orderBy: { dataInicio: "desc" },
      include: {
        criador: { select: { nome: true } },
      },
    });

    return NextResponse.json(projetos);
  } catch (error) {
    console.error("ERRO GET API:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar projetos no banco" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Autenticação necessária" },
        { status: 401 },
      );
    }

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json(
        { success: false, error: "Acesso negado: Somente administradores" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { nome, resumo, dataInicio, dataFim, situacao, anexos } = body;

    const novoProjeto = await prisma.projeto.create({
      data: {
        nome,
        resumo,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        situacao,
        anexos: Array.isArray(anexos) ? anexos : [],
        idUsuarioCriador: usuarioBanco.idUsuario,
      },
    });

    return NextResponse.json({ success: true, projeto: novoProjeto });
  } catch (error) {
    console.error("ERRO POST API:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao salvar projeto" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Auth required" },
        { status: 401 },
      );
    }

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { idProjeto, nome, resumo, dataInicio, dataFim, situacao, anexos } =
      body;

    const projetoAtualizado = await prisma.projeto.update({
      where: { idProjeto: Number(idProjeto) },
      data: {
        nome,
        resumo,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        situacao,
        anexos: Array.isArray(anexos) ? anexos : [],
      },
    });

    return NextResponse.json({ success: true, projeto: projetoAtualizado });
  } catch (error) {
    console.error("ERRO PUT API:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const idProjeto = searchParams.get("idProjeto");

    await prisma.participa.deleteMany({
      where: { idProjeto: Number(idProjeto) },
    });

    await prisma.projeto.delete({
      where: { idProjeto: Number(idProjeto) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO DELETE API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
