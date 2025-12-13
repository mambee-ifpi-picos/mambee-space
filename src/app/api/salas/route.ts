import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.from("Sala").select("*");

    if (error) {
      return NextResponse.json(
        { success: false, error: "Erro ao buscar salas." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, salas: data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro interno." },
      { status: 500 },
    );
  }
}

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

    const { nomeSala, mapa, limiteHorasReserva, ativa } = await req.json();

    if (!nomeSala || !mapa || !limiteHorasReserva) {
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

    if (limiteHorasReserva > 4) {
      return NextResponse.json(
        { success: false, error: "Limite máximo é 4 horas." },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("Sala")
      .insert([
        {
          nomeSala,
          mapa,
          limiteHorasReserva,
          ativa,
          idUsuarioCriador: usuario.idUsuario,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: "Erro ao criar sala." },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, sala: data[0] });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro interno." },
      { status: 500 },
    );
  }
}
