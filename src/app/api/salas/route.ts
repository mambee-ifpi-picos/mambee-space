import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomeSala, mapa, limiteHorasReserva, idUsuarioCriador } = body;

    if (!nomeSala || !mapa || !limiteHorasReserva || !idUsuarioCriador) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Sala")
      .insert([
        {
          nomeSala,
          mapa,
          limiteHorasReserva,
          idUsuarioCriador,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, sala: data[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function GET() {
  const { data, error } = await supabase.from("Sala").select("*");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, salas: data });
}
