import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: espacos, error: espacoError } = await supabase
      .from("Espaco")
      .select("*");
    if (espacoError)
      return NextResponse.json(
        { success: false, error: espacoError.message },
        { status: 400 }
      );

    const { data: salas, error: salaError } = await supabase
      .from("Sala")
      .select("*");
    if (salaError)
      return NextResponse.json(
        { success: false, error: salaError.message },
        { status: 400 }
      );

    const espacosComSala = espacos.map((e) => ({
      ...e,
      sala: salas.find((s) => s.idSala === e.idSalaPertence) || null,
    }));

    return NextResponse.json({ success: true, espacos: espacosComSala });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codigoEspaco, idSalaPertence, idUsuarioCriador } = body;

    if (!codigoEspaco || !idSalaPertence || !idUsuarioCriador)
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
        {
          success: false,
          error: "Apenas administradores podem criar espaços.",
        },
        { status: 403 }
      );

    const { data, error } = await supabase
      .from("Espaco")
      .insert([{ codigoEspaco, idSalaPertence, idUsuarioCriador }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, espaco: data[0] });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { idEspaco, codigoEspaco, idUsuarioEditor } = body;

    if (!idEspaco || !idUsuarioEditor)
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );

    const { data: usuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuarioEditor)
      .single();

    if (!usuario?.admin)
      return NextResponse.json(
        {
          success: false,
          error: "Apenas administradores podem editar espaços.",
        },
        { status: 403 }
      );

    const { data, error } = await supabase
      .from("Espaco")
      .update({ codigoEspaco })
      .eq("idEspaco", idEspaco)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, espaco: data[0] });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idEspaco = searchParams.get("idEspaco");
    const idUsuario = searchParams.get("idUsuario");

    if (!idEspaco || !idUsuario)
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
          error: "Apenas administradores podem deletar espaços.",
        },
        { status: 403 }
      );

    const { error } = await supabase
      .from("Espaco")
      .delete()
      .eq("idEspaco", idEspaco);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Espaço deletado com sucesso.",
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
