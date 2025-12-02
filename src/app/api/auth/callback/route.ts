import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código ausente" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { error: authError } = await supabase.auth.exchangeCodeForSession(code);

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user || !user.email) { 
    return NextResponse.json({ error: "Usuário ou email não encontrado" }, { status: 404 });
  }

  
  const email = user.email; 
  const nome = user.user_metadata?.full_name || user.user_metadata?.name || "Sem nome";
  const foto = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  try {
    await prisma.usuario.upsert({
      where: { email },
      update: { nome, foto },
      create: { nome, email, foto, admin: false },
    });
  } catch (err) { 
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao salvar no Prisma:", errorMessage);
  }

  return NextResponse.redirect(new URL("/home", req.url));
}