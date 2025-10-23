import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro ao logar:", error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login realizado com sucesso!",
      access_token: data.session?.access_token,
      user: data.user,
    });
  } catch (err: any) {
    console.error("Erro interno:", err.message);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    );
  }
}
