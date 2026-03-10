import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idAuth: user.id },
      select: {
        idUsuario: true,
        nome: true,
        email: true,
        foto: true,
        admin: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
