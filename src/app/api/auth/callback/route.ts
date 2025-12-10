import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", url));
  }

  const cookieStore = cookies();

  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error(sessionError.message);
    return NextResponse.redirect(new URL("/login?error=session", url));
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL("/login?error=user", url));
  }

  const nome =
    user.user_metadata?.full_name || user.user_metadata?.name || "Sem nome";

  const email = user.email!;

  const foto =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  const { data: existingUser } = await supabase
    .from("Usuario")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  const usuarioData: any = {
    idAuth: user.id,
    nome,
    email,
    foto,
  };

  if (existingUser) usuarioData.admin = existingUser.admin;

  await supabase.from("Usuario").upsert(usuarioData, { onConflict: "email" });

  return NextResponse.redirect(new URL("/dashboard", url));
}
