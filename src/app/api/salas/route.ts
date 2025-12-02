// app/api/salas/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Buscar todas as salas
    const { data: salasData, error: errorSalas } = await supabase
      .from("Sala")
      .select("idSala, nomeSala");

    if (errorSalas) throw errorSalas;

    // Buscar todos os espaços
    const { data: espacosData, error: errorEspacos } = await supabase
      .from("Espaco")
      .select("idEspaco, codigoEspaco, idSalaPertence");

    if (errorEspacos) throw errorEspacos;

    // Mapear espaços para suas respectivas salas
    const salas = (salasData ?? []).map((s: any) => ({
      idSala: s.idSala,
      nomeSala: s.nomeSala,
      espacos: (espacosData ?? []).filter(
        (e: any) => e.idSalaPertence === s.idSala
      ),
    }));

    return NextResponse.json({ success: true, salas });
  } catch (err) {
    console.error("Erro ao carregar salas:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}
