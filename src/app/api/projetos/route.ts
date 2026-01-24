import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projetos = await prisma.projeto.findMany({
      orderBy: { dataInicio: "desc" },
      include: {
        criador: {
          select: { nome: true },
        },
      },
    });
    return NextResponse.json(projetos);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao buscar projetos" },
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
        { success: false, error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    // 2. Busca no Prisma se ele é Admin mesmo
    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json(
        { success: false, error: "Permissão negada. Apenas administradores." },
        { status: 403 },
      );
    }

    // 3. Pega os dados do corpo da requisição
    const body = await req.json();
    const { nome, resumo, dataInicio, dataFim, situacao, anexos } = body;

    if (!nome || !dataInicio || !situacao) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 },
      );
    }

    // 4. Cria o projeto
    const novoProjeto = await prisma.projeto.create({
      data: {
        nome,
        resumo,
        dataInicio: new Date(dataInicio),
        dataFim: dataFim ? new Date(dataFim) : null,
        situacao,
        anexos,
        idUsuarioCriador: usuarioBanco.idUsuario,
      },
    });

    return NextResponse.json({ success: true, projeto: novoProjeto });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao criar projeto." },
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
        { success: false, error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json(
        { success: false, error: "Permissão negada." },
        { status: 403 },
      );
    }

    // 2. Atualiza o projeto
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
        anexos,
      },
    });

    return NextResponse.json({ success: true, projeto: projetoAtualizado });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar projeto." },
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
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco || !usuarioBanco.admin) {
      return NextResponse.json(
        { success: false, error: "Permissão negada." },
        { status: 403 },
      );
    }

    // 2. Pega o ID da URL
    const { searchParams } = new URL(req.url);
    const idProjeto = searchParams.get("idProjeto");

    if (!idProjeto) {
      return NextResponse.json(
        { success: false, error: "ID do projeto não fornecido." },
        { status: 400 },
      );
    }

    // 3. Remove dependências (Participações) antes de deletar o projeto
    await prisma.participa.deleteMany({
      where: { idProjeto: Number(idProjeto) },
    });

    // 4. Deleta o projeto
    await prisma.projeto.delete({
      where: { idProjeto: Number(idProjeto) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir projeto." },
      { status: 500 },
    );
  }
}
