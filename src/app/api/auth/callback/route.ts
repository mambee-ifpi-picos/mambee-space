import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options });
            });
          } catch {}
        },
      },
    },
  );

  const { error: authError } = await supabase.auth.exchangeCodeForSession(code);

  if (authError) {
    console.error("Erro ao autenticar:", authError.message);
    return NextResponse.redirect(new URL("/login?error=auth", req.url));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/login?error=user", req.url));
  }

  const nome =
    (user.user_metadata as any)?.full_name ||
    (user.user_metadata as any)?.name ||
    "Sem nome";

  const email = user.email ?? `no-mail-${user.id}@example.com`;

  const foto =
    (user.user_metadata as any)?.avatar_url ||
    (user.user_metadata as any)?.picture ||
    null;

  const { data: existingUser } = await supabase
    .from("Usuario")
    .select("*")
    .eq("email", email)
    .single();

  const usuarioParaSalvar: any = {
    idAuth: user.id,
    nome,
    email,
    foto,
  };

  // manter admin existente sem mudar
  if (existingUser) {
    usuarioParaSalvar.admin = existingUser.admin;
  }

  const { error: upsertError } = await supabase
    .from("Usuario")
    .upsert(usuarioParaSalvar, { onConflict: "email" });

  if (upsertError) {
    console.error("Erro ao salvar Usuario:", upsertError.message);
  }

  return NextResponse.redirect(new URL("/home", req.url));
}
