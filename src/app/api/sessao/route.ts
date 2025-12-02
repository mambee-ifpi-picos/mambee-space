import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json(
        { success: false, error: "Nenhuma sessão ativa." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { access_token: session.access_token, user: session.user },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
