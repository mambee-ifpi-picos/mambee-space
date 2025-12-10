import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const filtroSala = (searchParams.get("sala") ?? "").trim().toLowerCase();
    const filtroEspaco = (searchParams.get("espaco") ?? "")
      .trim()
      .toLowerCase();
    const filtroMotivo = (searchParams.get("motivo") ?? "")
      .trim()
      .toLowerCase();
    const filtroUsuario = (searchParams.get("usuario") ?? "")
      .trim()
      .toLowerCase();

    const dataInicio = searchParams.get("inicio");
    const dataFim = searchParams.get("fim");

    if (!dataInicio || !dataFim) {
      return NextResponse.json(
        {
          success: false,
          error: "Os campos 'inicio' e 'fim' são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const dtInicio = new Date(`${dataInicio}T00:00:00`);
    const dtFim = new Date(`${dataFim}T23:59:59`);

    const { data: reservasData, error: errorReservas } = await supabase
      .from("Reserva")
      .select("*")
      .order("horaInicio", { ascending: false });

    if (errorReservas) throw new Error(errorReservas.message);

    if (!reservasData) {
      return NextResponse.json({ success: true, reservas: [] });
    }

    const { data: espacos, error: errorEspacos } = await supabase
      .from("Espaco")
      .select("idEspaco, codigoEspaco, idSalaPertence");

    if (errorEspacos) throw new Error(errorEspacos.message);

    const { data: salas, error: errorSalas } = await supabase
      .from("Sala")
      .select("idSala, nomeSala");

    if (errorSalas) throw new Error(errorSalas.message);

    const { data: usuarios, error: errorUsuarios } = await supabase
      .from("Usuario")
      .select("idUsuario, nome, email");

    if (errorUsuarios) throw new Error(errorUsuarios.message);

    const reservasMapeadas = reservasData.map((r) => {
      const espaco = espacos.find((e) => e.idEspaco === r.idEspacoReservado);
      const sala = espaco
        ? salas.find((s) => s.idSala === espaco.idSalaPertence)
        : null;
      const usuario = usuarios.find((u) => u.idUsuario === r.idUsuarioCriador);

      return {
        id: r.idReserva,
        motivo: r.motivo ?? "",
        inicio: r.horaInicio ?? "",
        fim: r.horaFim ?? "",
        situacao: r.situacao ?? "",
        usuario: usuario?.nome ?? "",
        email: usuario?.email ?? "",
        sala: sala?.nomeSala ?? "",
        espaco: espaco?.codigoEspaco ?? "",
      };
    });

    const reservasFiltradas = reservasMapeadas.filter((res) => {
      const salaOK = res.sala.toLowerCase().includes(filtroSala);
      const espacoOK = res.espaco.toLowerCase().includes(filtroEspaco);
      const motivoOK = res.motivo.toLowerCase().includes(filtroMotivo);
      const usuarioOK = res.usuario.toLowerCase().includes(filtroUsuario);

      let dataOK = true;
      const dtInicioRes = new Date(res.inicio);

      if (dtInicio) dataOK = dataOK && dtInicioRes >= dtInicio;
      if (dtFim) dataOK = dataOK && dtInicioRes <= dtFim;

      return salaOK && espacoOK && motivoOK && usuarioOK && dataOK;
    });

    return NextResponse.json({
      success: true,
      total: reservasFiltradas.length,
      reservas: reservasFiltradas,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro inesperado";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
