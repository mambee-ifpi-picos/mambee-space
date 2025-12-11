import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", url));
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        async get(name) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name, value, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name, options: CookieOptions) {
          (await cookieStore).set({ name, value: "", ...options });
        },
      },
    },
  );

  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    console.error(sessionError.message);
    return NextResponse.redirect(new URL("/login?error=session", url));
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.redirect(new URL("/login?error=user", url));
  }

  const email = user.email!;
  const nomeGoogle =
    user.user_metadata?.full_name || user.user_metadata?.name || null;
  const fotoGoogle =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  const { data: existingUser } = await supabase
    .from("Usuario")
    .select("nome, foto, admin")
    .eq("email", email)
    .maybeSingle();

  const nomeFinal = existingUser?.nome ?? nomeGoogle ?? "Sem nome";
  const fotoFinal = existingUser?.foto ?? fotoGoogle ?? null;
  const adminFinal = existingUser?.admin ?? false;

  await supabase.from("Usuario").upsert(
    {
      idAuth: user.id,
      email: email,
      nome: nomeFinal,
      foto: fotoFinal,
      admin: adminFinal,
    },
    { onConflict: "email" },
  );

  return NextResponse.redirect(new URL("/dashboard", url));
}
