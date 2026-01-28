import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { idProjeto: string } }) {
  try {
    const idProjeto = parseInt(params.idProjeto);

    if (isNaN(idProjeto)) {
      return NextResponse.json({ error: "ID do projeto inválido" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verificar se é admin
    const usuarioBanco = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
    });

    if (!usuarioBanco?.admin) {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
    }

    // Buscar todas as participações deste projeto
    const participacoes = await prisma.participa.findMany({
      where: {
        idProjeto: idProjeto,
      },
      include: {
        usuario: {
          select: {
            idUsuario: true,
            nome: true,
            email: true,
            foto: true,
          },
        },
        projeto: {
          select: {
            idProjeto: true,
            nome: true,
          },
        },
      },
      orderBy: { idParticipa: "desc" },
    });

    return NextResponse.json(participacoes);
  } catch (error) {
    console.error("Erro ao buscar participações do projeto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
