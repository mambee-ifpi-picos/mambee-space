import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    const { codigoEspaco, idSalaPertence } = await req.json();

    if (!codigoEspaco || !idSalaPertence) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 },
      );
    }

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("idUsuario, admin")
      .eq("idAuth", user.id)
      .single();

    if (!usuario || !usuario.admin) {
      return NextResponse.json(
        { success: false, error: "Permissão negada." },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("Espaco")
      .insert([
        {
          codigoEspaco,
          idSalaPertence,
          idUsuarioCriador: usuario.idUsuario,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar espaço." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, espaco: data[0] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro interno." },
      { status: 500 },
    );
  }
}
