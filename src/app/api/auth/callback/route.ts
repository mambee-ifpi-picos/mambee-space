import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código ausente" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;
  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const nome = user.user_metadata?.full_name || user.user_metadata?.name;
  const email = user.email;
  const foto = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const { error: dbError } = await supabase.from("usuarios").upsert(
    {
      id: user.id,
      nome: nome || "Sem nome",
      email,
      foto,
    },
    { onConflict: "email" }
  );

  if (dbError) console.error("Erro ao salvar no banco:", dbError);

  return NextResponse.redirect(new URL("/home", req.url));
}
