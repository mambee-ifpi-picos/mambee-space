import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";
import { NextResponse } from "next/server";

type UsuarioInfo = {
  foto: string;
  email: string;
  nome: string;
};

type SalaInfo = {
  nomeSala: string;
};

type EspacoInfo = {
  codigoEspaco: string;
  Sala: SalaInfo[];
};

type ReservaComUsuario = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  situacao: string;
  UsuarioCriador?: UsuarioInfo[];
  Espaco?: EspacoInfo[];
};

export async function GET(_req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const hoje = new Date();

    const depois24 = new Date(hoje.getTime() + 1000 * 60 * 60 * 24);

    let query = supabase
      .from("Reserva")
      .select(`
    idReserva,
    motivo,
    horaInicio,
    horaFim,
    situacao,
    Usuario: idUsuarioCriador(nome,email,foto),
    Espaco: idEspacoReservado(
      codigoEspaco,
      Sala: idSalaPertence (nomeSala)
    )
  `)
      .neq("situacao", "CANCELADA")
      .order("horaInicio", { ascending: true });

    query = query
      .gte("horaFim", hoje.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
      .lte("horaInicio", depois24.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    console.log(depois24.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const res = await query;
    if (res.error) throw res.error;

    const rawData = Array.isArray(res.data) ? res.data : [];
    const reservas = rawData as unknown as ReservaComUsuario[];

    const relatorio = reservas.map((reserva) => {
      const usuarioData = Array.isArray(reserva.UsuarioCriador) ? reserva.UsuarioCriador[0] : reserva.UsuarioCriador;

      const espacoData = Array.isArray(reserva.Espaco) ? reserva.Espaco[0] : reserva.Espaco;

      const salaData = Array.isArray(espacoData?.Sala) ? espacoData?.Sala[0] : espacoData?.Sala;
      return {
        id: reserva.id,
        motivo: reserva.motivo ?? "",
        inicio: reserva.inicio ?? "",
        fim: reserva.fim ?? "",
        situacao: reserva.situacao ?? "",
        usuario: usuarioData?.nome ?? "",
        email: usuarioData?.email ?? "",
        foto: usuarioData?.foto ?? "",
        sala: reserva?.Espaco ?? "",
        espaco: reserva?.Espaco ?? "",
      };
    });

    return NextResponse.json({
      success: true,
      total: relatorio.length,
      reservas,
    });
  } catch (error: unknown) {
    console.error("ERRO AO GERAR RELATÓRIO:", error);
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
