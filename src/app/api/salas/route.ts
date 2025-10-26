import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: salas, error: salaError } = await supabase
    .from("Sala")
    .select("*");
  if (salaError) {
    return NextResponse.json(
      { success: false, error: salaError.message },
      { status: 400 }
    );
  }

  const { data: espacos, error: espacoError } = await supabase
    .from("Espaco")
    .select("*");
  if (espacoError) {
    return NextResponse.json(
      { success: false, error: espacoError.message },
      { status: 400 }
    );
  }

  const salasComEspacos = salas.map((sala) => ({
    ...sala,
    espacos: espacos.filter((e) => e.idSalaPertence === sala.idSala),
  }));

  return NextResponse.json({ success: true, salas: salasComEspacos });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomeSala, mapa, limiteHorasReserva, idUsuarioCriador } = body;

    if (!nomeSala || !mapa || !limiteHorasReserva || !idUsuarioCriador)
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuarioCriador)
      .single();

    if (!usuario?.admin)
      return NextResponse.json(
        { success: false, error: "Apenas administradores podem criar salas." },
        { status: 403 }
      );

    if (limiteHorasReserva > 4)
      return NextResponse.json(
        { success: false, error: "O limite máximo de horas por reserva é 4." },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from("Sala")
      .insert([{ nomeSala, mapa, limiteHorasReserva, idUsuarioCriador }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, sala: data[0] });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      idSala,
      nomeSala,
      mapa,
      limiteHorasReserva,
      ativa,
      idUsuarioEditor,
    } = body;

    if (!idSala || !idUsuarioEditor) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuarioEditor)
      .single();

    if (!usuario?.admin) {
      return NextResponse.json(
        { success: false, error: "Apenas administradores podem editar salas." },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (nomeSala) updateData.nomeSala = nomeSala;
    if (mapa) updateData.mapa = mapa;
    if (limiteHorasReserva) updateData.limiteHorasReserva = limiteHorasReserva;
    if (typeof ativa === "boolean") updateData.ativa = ativa;

    const { data, error } = await supabase
      .from("Sala")
      .update(updateData)
      .eq("idSala", idSala)
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      sala: data[0],
      message:
        ativa === true
          ? "Sala ativada com sucesso."
          : ativa === false
          ? "Sala desativada com sucesso."
          : "Sala atualizada com sucesso.",
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idSala = searchParams.get("idSala");
    const idUsuario = searchParams.get("idUsuario");

    if (!idSala || !idUsuario)
      return NextResponse.json(
        { success: false, error: "Parâmetros ausentes." },
        { status: 400 }
      );

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuario)
      .single();

    if (!usuario?.admin)
      return NextResponse.json(
        {
          success: false,
          error: "Apenas administradores podem deletar salas.",
        },
        { status: 403 }
      );

    await supabase.from("Espaco").delete().eq("idSalaPertence", idSala);

    const { error } = await supabase.from("Sala").delete().eq("idSala", idSala);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Sala deletada com sucesso.",
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
