import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";

export const dynamic = 'force-dynamic';


function pegarValor(obj: any, chavesPossiveis: string[]) {
  if (!obj) return null;
  for (const chave of chavesPossiveis) {
    if (obj[chave] !== undefined && obj[chave] !== null) return obj[chave];
  }
  const chavesDoObjeto = Object.keys(obj);
  for (const chavePossivel of chavesPossiveis) {
    const chaveReal = chavesDoObjeto.find((k) => k.toLowerCase() === chavePossivel.toLowerCase());
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

    
    const filtroSala = (searchParams.get("sala") ?? "").trim().toLowerCase();
    const filtroEspaco = (searchParams.get("espaco") ?? "").trim().toLowerCase();
    const filtroUsuario = (searchParams.get("usuario") ?? "").trim().toLowerCase();
    const inicioParam = searchParams.get("inicio");
    const fimParam = searchParams.get("fim");

    if (!inicioParam || !fimParam) {
      return NextResponse.json({ success: false, error: "Datas obrigatórias" }, { status: 400 });
    }

    console.log("--- Iniciando busca Relatório ---");

    
    const { data: reservasData, error: errRes } = await supabase
      .from("Reserva") 
      .select("*")
      .neq("situacao", "CANCELADA")
      .order("horaInicio", { ascending: true });

    if (errRes) {
      console.error("Erro ao buscar tabela Reserva:", errRes);
      throw new Error(`Erro no banco (Reserva): ${errRes.message}`);
    }

    
    const [resUsuarios, resEspacos, resSalas] = await Promise.all([
      supabase.from("Usuario").select("*"), 
      supabase.from("Espaco").select("*"),  
      supabase.from("Sala").select("*")     
    ]);

    const usuarios = resUsuarios.data ?? [];
    const espacos = resEspacos.data ?? [];
    const salas = resSalas.data ?? [];

    
    const reservasMapeadas = (reservasData ?? []).map((r: any) => {
      
      const idCriadorRaw = pegarValor(r, ["idUsuarioCriador", "idusuariocriador", "id_usuario_criador", "usuario_id", "idUsuario"]);
      const idCriadorString = String(idCriadorRaw);

      
      let usuarioReal = usuarios.find((u: any) => {
        const idUser = pegarValor(u, ["idUsuario", "idusuario", "id_usuario", "id"]);
        return String(idUser) === idCriadorString;
      });
      
      
      if (!usuarioReal) {
        const idAuthReserva = pegarValor(r, ["idAuth", "id_auth"]);
        if (idAuthReserva) {
          usuarioReal = usuarios.find((u: any) => String(pegarValor(u, ["idAuth", "id_auth"])) === String(idAuthReserva));
        }
      }

      
      const idEspacoResRaw = pegarValor(r, ["idEspacoReservado", "id_espaco_reservado", "idespacoreservado", "espaco_id"]);
      const espaco = espacos.find((e: any) => String(pegarValor(e, ["idEspaco", "idespaco", "id"])) === String(idEspacoResRaw));

      
      let sala = null;
      if (espaco) {
        const idSalaPertence = pegarValor(espaco, ["idSalaPertence", "idsalapertence", "sala_id", "id_sala"]);
        sala = salas.find((s: any) => String(pegarValor(s, ["idSala", "idsala", "id"])) === String(idSalaPertence));
      }

      
      const nomeUsuario = usuarioReal ? (pegarValor(usuarioReal, ["nome", "Nome"]) || "Sem Nome") : "Desconhecido";
      const fotoUsuario = usuarioReal ? (pegarValor(usuarioReal, ["foto", "avatar_url"]) || null) : null;
      const nomeSala = sala ? (pegarValor(sala, ["nomeSala", "nomesala", "nome"]) || "") : "";
      const nomeEspaco = espaco ? (pegarValor(espaco, ["codigoEspaco", "codigoespaco", "nome"]) || "") : "";
      
      const inicioRaw = pegarValor(r, ["horaInicio", "horainicio", "inicio"]);
      const fimRaw = pegarValor(r, ["horaFim", "horafim", "fim"]);

      return {
        id: r.idReserva || r.id || Math.random(),
        motivo: r.motivo || "",
        inicio: inicioRaw || "",
        fim: fimRaw || "",
        usuario: nomeUsuario,
        email: "",
        foto: fotoUsuario,
        sala: nomeSala,
        espaco: nomeEspaco,
      };
    });

    // 4. FILTRAGEM
    const reservasFiltradas = reservasMapeadas.filter((res: any) => {
      // Filtros de texto
      if (filtroSala && !res.sala.toLowerCase().includes(filtroSala)) return false;
      if (filtroEspaco && !res.espaco.toLowerCase().includes(filtroEspaco)) return false;
      if (filtroUsuario && !res.usuario.toLowerCase().includes(filtroUsuario)) return false;

      // Filtro de Data
      if (!res.inicio) return false;
      const dataItem = new Date(res.inicio);
      
      // Ajuste de fuso horário simples (Data String pura)
      const dataFiltroInicio = new Date(inicioParam + "T00:00:00");
      const dataFiltroFim = new Date(fimParam + "T23:59:59");

      if (isNaN(dataItem.getTime())) return false;

      return dataItem >= dataFiltroInicio && dataItem <= dataFiltroFim;
    });

    console.log(`Sucesso: ${reservasFiltradas.length} reservas encontradas.`);

    return NextResponse.json({ success: true, reservas: reservasFiltradas });

  } catch (err: any) {
    console.error("=== ERRO API ===", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}