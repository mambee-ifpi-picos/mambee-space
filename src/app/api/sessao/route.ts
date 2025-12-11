// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { createServerClient } from "@supabase/ssr";

export async function GET() {
  // try {
  //   const cookieStore = cookies();
  //   const supabase = createServerClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  //     {
  //       cookies: {
  //         get: (name) => cookieStore.get(name)?.value,
  //         set: (name, value, options) => cookieStore.set(name, value, options),
  //         remove: (name, options) => cookieStore.set(name, "", options),
  //       },
  //     },
  //   );
  //   const {
  //     data: { session },
  //     error,
  //   } = await supabase.auth.getSession();
  //   if (error || !session) {
  //     return NextResponse.json(
  //       { success: false, error: "Nenhuma sessão ativa." },
  //       { status: 401 },
  //     );
  //   }
  //   return NextResponse.json({
  //     success: true,
  //     data: {
  //       access_token: session.access_token,
  //       user: session.user,
  //     },
  //   });
  // } catch (err) {
  //   const msg = err instanceof Error ? err.message : "Erro desconhecido.";
  //   return NextResponse.json({ success: false, error: msg }, { status: 500 });
  // }
}
