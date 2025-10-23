import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.json(
      { error: "Nenhuma sessão ativa." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    access_token: session.access_token,
    user: session.user,
  });
}
