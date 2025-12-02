// app/api/reservas/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// --- GET: Listar reservas ---
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dataReserva = searchParams.get("data");
    const idEspaco = searchParams.get("idEspaco");

    if (!dataReserva || !idEspaco) {
      return NextResponse.json(
        {
          success: false,
          error: "Parâmetros 'data' e 'idEspaco' são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const idEspacoNum = Number(idEspaco);

    const { data, error } = await supabase
      .from("Reserva")
      .select(
        "idReserva, motivo, horaInicio, horaFim, Espaco(codigoEspaco), criador:Usuario!idUsuarioCriador(nome,email)"
      )
      .eq("idEspacoReservado", idEspacoNum)
      .gte("horaInicio", `${dataReserva}T00:00:00.000Z`)
      .lt("horaInicio", `${dataReserva}T23:59:59.999Z`)
      .order("horaInicio", { ascending: true });

    if (error) throw error;

    const reservasFormatadas = (data ?? []).map((r: any) => ({
      idReserva: r.idReserva,
      motivo: r.motivo,
      horaInicio: r.horaInicio,
      horaFim: r.horaFim,
      espaco: r.Espaco,
      criador: r.criador,
    }));

    return NextResponse.json({ success: true, reservas: reservasFormatadas });
  } catch (err) {
    console.error("Erro ao buscar reservas:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}

// --- POST: Criar reserva ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { idEspaco, data, inicio, fim, motivo, idCriador } = body;

    if (!idEspaco || !data || !inicio || !fim || !motivo || !idCriador) {
      return NextResponse.json(
        { success: false, error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const horaInicio = `${data}T${inicio}:00.000Z`;
    const horaFim = `${data}T${fim}:00.000Z`;

    const { data: novaReserva, error } = await supabase
      .from("Reserva")
      .insert({
        idEspacoReservado: idEspaco,
        idUsuarioCriador: idCriador,
        motivo,
        horaInicio,
        horaFim,
        situacao: "Confirmada",
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reserva: novaReserva });
  } catch (err) {
    console.error("Erro ao criar reserva:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}
