import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json([], { status: 200 });

    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco) return NextResponse.json([], { status: 200 });

    const participacoes = await prisma.participa.findMany({
      where: { idUsuario: usuarioBanco.idUsuario },
      select: {
        idProjeto: true,
        situacao: true,
      },
    });

    return NextResponse.json(participacoes);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar participações" },
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
        { error: "Você precisa estar logado." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { idProjeto, motivo } = body;

    if (!idProjeto || !motivo) {
      return NextResponse.json(
        { error: "Motivo é obrigatório." },
        { status: 400 },
      );
    }

    // Pega o usuário do banco
    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco) {
      return NextResponse.json(
        { error: "Usuário não encontrado no sistema." },
        { status: 404 },
      );
    }

    const jaExiste = await prisma.participa.findFirst({
      where: {
        idProjeto: Number(idProjeto),
        idUsuario: usuarioBanco.idUsuario,
      },
    });

    if (jaExiste) {
      return NextResponse.json(
        { error: "Você já solicitou participação neste projeto." },
        { status: 400 },
      );
    }

    // Cria a participação
    const novaParticipacao = await prisma.participa.create({
      data: {
        idProjeto: Number(idProjeto),
        idUsuario: usuarioBanco.idUsuario,
        motivo: motivo,
        situacao: "Solicitado",
      },
    });

    return NextResponse.json({ success: true, data: novaParticipacao });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
