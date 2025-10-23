import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código ausente" }, { status: 400 });
  }

  // Cria o cliente Supabase com cookies do Next.js
  const supabase = createRouteHandlerClient({ cookies });

  // Troca o código pela sessão do usuário (cria o cookie automaticamente)
  const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
  if (authError) {
    console.error("Erro ao autenticar:", authError.message);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Obtém o usuário autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const nome = user.user_metadata?.full_name || user.user_metadata?.name || "Sem nome";
  const email = user.email!;
  const foto = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  try {
    // Usa e-mail como referência, já que o id é autoincremental
    await prisma.usuario.upsert({
      where: { email },
      update: { nome, foto },
      create: {
        nome,
        email,
        foto,
        admin: false,
      },
    });

    console.log("Usuário salvo/atualizado no Prisma com sucesso!");
  } catch (err: any) {
    console.error("Erro ao salvar no Prisma:", err.message);
  }

  // Redireciona para /home após salvar
  return NextResponse.redirect(new URL("/home", req.url));
}
