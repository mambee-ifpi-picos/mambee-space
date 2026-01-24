import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

const prisma = new PrismaClient();

// Função auxiliar de verificação de Admin
async function verificarAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const usuarioBanco = await prisma.usuario.findUnique({
    where: { idAuth: user.id },
  });

  if (usuarioBanco?.admin) return usuarioBanco;
  return null;
}

// GET: Listar TODAS as solicitações pendentes
export async function GET() {
  try {
    const admin = await verificarAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const solicitacoes = await prisma.participa.findMany({
      where: { situacao: "Solicitado" },
      include: {
        usuario: {
          select: { nome: true, email: true, foto: true },
        },
        projeto: {
          select: { nome: true },
        },
      },
      orderBy: { idParticipa: "desc" },
    });

    return NextResponse.json(solicitacoes);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar solicitações." },
      { status: 500 },
    );
  }
}

// PUT: Aprovar ou Negar
export async function PUT(req: Request) {
  try {
    const admin = await verificarAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const body = await req.json();
    const { idParticipa, novaSituacao, motivoSituacao } = body; // novaSituacao = "Autorizado" ou "Negado"

    if (!["Autorizado", "Negado"].includes(novaSituacao)) {
      return NextResponse.json(
        { error: "Situação inválida." },
        { status: 400 },
      );
    }

    const atualizado = await prisma.participa.update({
      where: { idParticipa: Number(idParticipa) },
      data: {
        situacao: novaSituacao,
        motivoSituacao: motivoSituacao || null, // Motivo da recusa (opcional se for aprovar)
        idAdmin: admin.idUsuario, // Grava QUEM aprovou/negou
      },
    });

    return NextResponse.json({ success: true, data: atualizado });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar solicitação." },
      { status: 500 },
    );
  }
}
