import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";


async function gerarProximoCodigo(idSalaPertence: number) {
  const { data, error } = await supabase
    .from("Espaco")
    .select("codigoEspaco")
    .eq("idSalaPertence", idSalaPertence)
    .order("idEspaco", { ascending: false })
    .limit(1);

  if (error) throw error;

  const ultimo = data?.[0]?.codigoEspaco;
  if (!ultimo) return "Mambee 001";

  const numero = parseInt(ultimo.split(" ")[1] || "0", 10) + 1;
  return `Mambee ${numero.toString().padStart(3, "0")}`;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codigoEspaco, idSalaPertence, idUsuarioCriador } = body;

    if (!idSalaPertence || !idUsuarioCriador) {
      return NextResponse.json(
        { success: false, error: "idSalaPertence e idUsuarioCriador são obrigatórios." },
        { status: 400 }
      );
    }

    const codigoFinal = codigoEspaco || (await gerarProximoCodigo(idSalaPertence));

    const { data, error } = await supabase
      .from("Espaco")
      .insert([
        {
          codigoEspaco: codigoFinal,
          idSalaPertence,
          idUsuarioCriador,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, espaco: data[0] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idSala = searchParams.get("idSala");

  let query = supabase.from("Espaco").select("*");

  if (idSala) query = query.eq("idSalaPertence", idSala);

  const { data, error } = await query.order("idEspaco", { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, espacos: data });
}
