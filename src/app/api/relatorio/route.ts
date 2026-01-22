import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

/**
 * Função auxiliar para recuperar valor de uma propriedade em um objeto
 * ignorando se a chave está em maiúsculo ou minúsculo (Case Insensitive).
 */
function pegarValor(obj: Record<string, unknown> | null, chavesPossiveis: string[]) {
  if (!obj) return null;
  const chavesDoObjeto = Object.keys(obj);

  for (const chave of chavesPossiveis) {
    // 1. Tenta pegar a chave exata
    if (obj[chave] !== undefined && obj[chave] !== null) return obj[chave];

    // 2. Tenta encontrar a chave ignorando Case Sensitive
    const chaveReal = chavesDoObjeto.find((k) => k.toLowerCase() === chave.toLowerCase());
    if (chaveReal && obj[chaveReal] !== undefined && obj[chaveReal] !== null) {
      return obj[chaveReal];
    }
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createSupabaseServerClient();

    // --- Filtros ---
    const filtroSala = (searchParams.get("sala") ?? "").trim().toLowerCase();
    const filtroEspaco = (searchParams.get("espaco") ?? "").trim().toLowerCase();
    const filtroMotivo = (searchParams.get("motivo") ?? "").trim().toLowerCase();
    const filtroUsuario = (searchParams.get("usuario") ?? "").trim().toLowerCase();

    const dataInicio = searchParams.get("inicio");
    const dataFim = searchParams.get("fim");

    if (!dataInicio || !dataFim) {
      return NextResponse.json({ success: false, error: "Datas obrigatórias" }, { status: 400 });
    }

    // 1. Busca Reservas (Ordenadas por Data Crescente)
    const { data: reservasData, error: errRes } = await supabase
      .from("Reserva")
      .select("*")
      .neq("situacao", "CANCELADA")
      .order("horaInicio", { ascending: true });

    if (errRes) throw new Error(`Erro Reserva: ${errRes.message}`);

    // 2. Busca Dados Auxiliares (Usuários, Espaços, Salas)
    const { data: usuarios } = await supabase.from("Usuario").select("*");
    const { data: espacos } = await supabase.from("Espaco").select("*");
    const { data: salas } = await supabase.from("Sala").select("*");

    // 3. Processamento e Cruzamento de Dados
    const reservasMapeadas =
      reservasData?.map((r) => {
        // Recupera ID do Criador (suporta variações de nome da coluna)
        const idCriadorRaw = pegarValor(r, [
          "idUsuarioCriador",
          "idusuariocriador",
          "id_usuario_criador",
          "idUsuario",
          "idusuario",
          "criador_id",
        ]);
        const idCriadorString = String(idCriadorRaw);

        // Encontra o usuário na lista
        const usuarioReal = usuarios?.find((u) => {
          const idUserRaw = pegarValor(u, ["idUsuario", "idusuario", "id_usuario", "id", "userId"]);
          return String(idUserRaw) === idCriadorString;
        });

        // Fallback: Tenta encontrar via idAuth se o idUsuario falhar
        let usuarioFinal = usuarioReal;
        if (!usuarioFinal && usuarios) {
          const idAuthReserva = pegarValor(r, ["idAuth", "id_auth"]);
          if (idAuthReserva) {
            usuarioFinal = usuarios.find((u) => {
              const idAuthUser = pegarValor(u, ["idAuth", "id_auth"]);
              return String(idAuthUser) === String(idAuthReserva);
            });
          }
        }

        // Recupera ID do Espaço
        const idEspacoResRaw = pegarValor(r, ["idEspacoReservado", "id_espaco_reservado", "idespacoreservado"]);

        // Encontra Espaço e Sala vinculada
        const espaco = espacos?.find((e) => String(pegarValor(e, ["idEspaco", "idespaco"])) === String(idEspacoResRaw));

        const sala = espaco
          ? salas?.find(
              (s) =>
                String(pegarValor(s, ["idSala", "idsala"])) ===
                String(pegarValor(espaco, ["idSalaPertence", "idsalapertence"])),
            )
          : null;

        // Define nome de exibição (Nome do usuário ou ID caso não encontrado)
        let nomeDisplay = "Usuário Desconhecido";
        if (usuarioFinal?.nome) {
          nomeDisplay = usuarioFinal.nome;
        } else {
          nomeDisplay = `Desconhecido (ID: ${idCriadorRaw})`;
        }

        return {
          id: r.idReserva,
          motivo: r.motivo ?? "",
          inicio: r.horaInicio ?? "",
          fim: r.horaFim ?? "",
          usuario: nomeDisplay,
          email: usuarioFinal?.email ?? "",
          foto: usuarioFinal?.foto || null,
          sala: sala?.nomeSala ?? "",
          espaco: espaco?.codigoEspaco ?? "",
        };
      }) ?? [];

    // 4. Filtragem no Servidor
    const reservasFiltradas = reservasMapeadas.filter((res) => {
      const salaOK = res.sala.toLowerCase().includes(filtroSala);
      const espacoOK = res.espaco.toLowerCase().includes(filtroEspaco);
      const motivoOK = res.motivo.toLowerCase().includes(filtroMotivo);
      const usuarioOK = res.usuario.toLowerCase().includes(filtroUsuario);

      const dtInicioRes = new Date(res.inicio);
      const dtInicioFiltro = new Date(`${dataInicio}T00:00:00`);
      const dtFimFiltro = new Date(`${dataFim}T23:59:59`);

      const dataOK =
        dtInicioRes.getTime() >= dtInicioFiltro.getTime() && dtInicioRes.getTime() <= dtFimFiltro.getTime();

      return salaOK && espacoOK && motivoOK && usuarioOK && dataOK;
    });

    return NextResponse.json({
      success: true,
      reservas: reservasFiltradas,
    });
  } catch (err: unknown) {
    console.error("Erro no Relatório:", err);
    const msg = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
