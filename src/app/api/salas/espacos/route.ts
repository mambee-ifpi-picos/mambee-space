// app/api/reservas/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// --- Tipos de Dados ---
type EspacoRow = {
  idEspaco: number;
  codigoEspaco?: string | null;
  idSalaPertence?: number | null;
};

type ReservaRow = {
  idReserva: number;
  motivo?: string | null;
  horaInicio: string;
  horaFim: string;
  situacao?: string | null;
  idUsuarioCriador: number;
  idEspacoReservado: number;
  Espaco?: EspacoRow | null;
};
// -----------------------

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Parâmetros do Modo Cronograma
    const dataReserva = searchParams.get("data"); // YYYY-MM-DD
    const idEspacoFilter = searchParams.get("idEspaco");

    // Parâmetros do Modo Paginação
    const idUsuario = searchParams.get("idUsuario");
    const pagina = parseInt(searchParams.get("pagina") ?? "1", 10);
    const itensPorPagina = parseInt(
      searchParams.get("itensPorPagina") ?? "9",
      10
    );
    const search = searchParams.get("search")?.trim().toLowerCase() || null;

    const isCronogramaMode = !!dataReserva && !!idEspacoFilter;

    // --- 1. Modo Cronograma (Visualização de Disponibilidade) ---
    if (isCronogramaMode) {
      const idEspacoNum = Number(idEspacoFilter);

      if (isNaN(idEspacoNum)) {
        return NextResponse.json(
          { success: false, error: "ID de espaço inválido." },
          { status: 400 }
        );
      }

      // 1.1. Definir o range de datas
      const dataInicioFiltro = `${dataReserva}T00:00:00`;

      const nextDay = new Date(dataReserva);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayISO = nextDay.toISOString().split("T")[0];
      const dataFimFiltro = `${nextDayISO}T00:00:00`;

      // 1.2. Construir a Query (incluindo dados do criador)
      let queryCronograma = supabase
        .from("Reserva")
        .select(
          `
          idReserva,
          motivo,
          horaInicio,
          horaFim,
          Espaco(codigoEspaco), 
          criador: Usuario(nome, email)
        `
        )
        .eq("idEspacoReservado", idEspacoNum)
        // Filtra reservas que começam no dia (dataReserva)
        .gte("horaInicio", dataInicioFiltro)
        .lt("horaInicio", dataFimFiltro)
        .order("horaInicio", { ascending: true });

      const { data, error } = await queryCronograma;

      if (error) {
        console.error("Erro Supabase (Cronograma):", error);
        throw error;
      }

      // 1.3. Mapear para a estrutura esperada pelo front-end
      const reservasFormatadas = (data ?? []).map((r: any) => ({
        idReserva: r.idReserva,
        motivo: r.motivo,
        horaInicio: r.horaInicio,
        horaFim: r.horaFim,
        espaco: r.Espaco,
        criador: r.criador, // Usamos o alias 'criador'
      }));

      return NextResponse.json({
        success: true,
        reservas: reservasFormatadas,
        total: reservasFormatadas.length,
      });
    }

    // --- 2. Modo Paginação (Listagem Principal - Lógica Anterior) ---

    if (!idUsuario) {
      return NextResponse.json(
        { success: false, error: "Informe o ID do usuário." },
        { status: 400 }
      );
    }

    // --- Lógica de Paginação (Mantida) ---
    const offset = (pagina - 1) * itensPorPagina;

    const { data: usuario, error: erroUsuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuario)
      .single();

    if (erroUsuario) throw erroUsuario;

    let query = supabase
      .from("Reserva")
      .select("*, Espaco(codigoEspaco, idSalaPertence)", { count: "exact" });

    if (!usuario?.admin) {
      query = query.eq("idUsuarioCriador", idUsuario);
    }

    const { data, error, count } = await query
      .order("horaInicio", { ascending: false })
      .range(offset, offset + itensPorPagina - 1);

    if (error) throw error;

    const reservasData = (data ?? []) as ReservaRow[];

    let reservasFinais: ReservaRow[] = reservasData;
    if (search) {
      reservasFinais = reservasData.filter((reserva) =>
        (reserva.motivo ?? "").toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      reservas: reservasFinais,
      total: count,
    });
    // --- Fim da Lógica de Paginação ---
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, null, 2) || "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      motivo: string;
      horaInicio: string;
      horaFim: string;
      situacao: string;
      idUsuarioCriador: number;
      idEspacoReservado: number;
    };

    const {
      motivo,
      horaInicio,
      horaFim,
      situacao,
      idUsuarioCriador,
      idEspacoReservado,
    } = body;

    if (
      !motivo ||
      !horaInicio ||
      !horaFim ||
      !situacao ||
      !idUsuarioCriador ||
      !idEspacoReservado
    ) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data: espaco, error: erroEspaco } = await supabase
      .from("Espaco")
      .select("idEspaco, idSalaPertence")
      .eq("idEspaco", idEspacoReservado)
      .single();

    if (erroEspaco) throw erroEspaco;
    if (!espaco)
      return NextResponse.json(
        { success: false, error: "Espaço não encontrado." },
        { status: 404 }
      );

    const { data: sala, error: erroSala } = await supabase
      .from("Sala")
      .select("ativa")
      .eq("idSala", espaco.idSalaPertence)
      .single();

    if (erroSala) throw erroSala;
    if (!sala?.ativa)
      return NextResponse.json(
        { success: false, error: "A sala deste espaço está inativa." },
        { status: 403 }
      );

    const inicio = new Date(horaInicio).getTime();
    const fim = new Date(horaFim).getTime();
    const duracaoHoras = (fim - inicio) / (1000 * 60 * 60);

    if (duracaoHoras > 4)
      return NextResponse.json(
        { success: false, error: "O limite máximo de reserva é de 4 horas." },
        { status: 400 }
      );

    const { data: conflitos, error: erroConflito } = await supabase
      .from("Reserva")
      .select("idReserva, horaInicio, horaFim")
      .eq("idEspacoReservado", idEspacoReservado)
      .or(`and(horaInicio.lt."${horaFim}",horaFim.gt."${horaInicio}")`);

    if (erroConflito) throw erroConflito;
    if (conflitos && (conflitos as ReservaRow[]).length > 0)
      return NextResponse.json(
        {
          success: false,
          error: "Já existe uma reserva nesse horário para este espaço.",
        },
        { status: 409 }
      );

    const { data, error } = await supabase
      .from("Reserva")
      .insert([
        {
          motivo,
          horaInicio,
          horaFim,
          situacao: "Confirmada", // Assumindo confirmada na criação
          idUsuarioCriador,
          idEspacoReservado,
        },
      ])
      .select();

    if (error) throw error;

    const inserted = (data ?? [])[0] as ReservaRow | undefined;

    return NextResponse.json({
      success: true,
      data: { reserva: inserted },
      message: "Reserva criada com sucesso.",
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : JSON.stringify(error, null, 2) || "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as {
      idReserva: number;
      motivo?: string;
      horaInicio?: string;
      horaFim?: string;
      situacao?: string;
      idUsuarioEditor: number;
    };

    const {
      idReserva,
      motivo,
      horaInicio,
      horaFim,
      situacao,
      idUsuarioEditor,
    } = body;

    if (!idReserva || !idUsuarioEditor) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data: usuario, error: erroUsuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuarioEditor)
      .single();

    if (erroUsuario) throw erroUsuario;

    const { data: reservaExistente, error: erroReserva } = await supabase
      .from("Reserva")
      .select("idUsuarioCriador, idEspacoReservado, horaInicio, horaFim")
      .eq("idReserva", idReserva)
      .single();

    if (erroReserva) throw erroReserva;

    if (!reservaExistente)
      return NextResponse.json(
        { success: false, error: "Reserva não encontrada." },
        { status: 404 }
      );

    if (
      !usuario?.admin &&
      reservaExistente.idUsuarioCriador !== Number(idUsuarioEditor)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Você não tem permissão para editar esta reserva.",
        },
        { status: 403 }
      );
    }

    const inicio = horaInicio ? new Date(horaInicio).getTime() : null;
    const fim = horaFim ? new Date(horaFim).getTime() : null;

    if (inicio && fim) {
      const duracaoHoras = (fim - inicio) / (1000 * 60 * 60);
      if (duracaoHoras > 4) {
        return NextResponse.json(
          {
            success: false,
            error: "O limite máximo de reserva é de 4 horas.",
          },
          { status: 400 }
        );
      }

      const { data: conflitos, error: erroConflito } = await supabase
        .from("Reserva")
        .select("idReserva, horaInicio, horaFim")
        .eq("idEspacoReservado", reservaExistente.idEspacoReservado)
        .neq("idReserva", idReserva)
        .or(`and(horaInicio.lt.${horaFim},horaFim.gt.${horaInicio})`);

      if (erroConflito) throw erroConflito;

      if (
        (conflitos as ReservaRow[]) &&
        (conflitos as ReservaRow[]).length > 0
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Já existe uma reserva nesse horário para este espaço.",
          },
          { status: 409 }
        );
      }
    }

    const { data, error } = await supabase
      .from("Reserva")
      .update({ motivo, horaInicio, horaFim, situacao })
      .eq("idReserva", idReserva)
      .select();

    if (error) throw error;

    const updated = (data ?? [])[0] as ReservaRow | undefined;

    return NextResponse.json({
      success: true,
      data: { reserva: updated },
      message: "Reserva atualizada com sucesso.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idReserva = searchParams.get("idReserva");
    const idUsuario = searchParams.get("idUsuario");

    if (!idReserva || !idUsuario) {
      return NextResponse.json(
        { success: false, error: "Parâmetros ausentes." },
        { status: 400 }
      );
    }

    const { data: usuario, error: erroUsuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuario)
      .single();

    if (erroUsuario) throw erroUsuario;

    const { data: reserva, error: erroReserva } = await supabase
      .from("Reserva")
      .select("idUsuarioCriador")
      .eq("idReserva", idReserva)
      .single();

    if (erroReserva) throw erroReserva;

    if (!reserva) {
      return NextResponse.json(
        { success: false, error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

    if (!usuario?.admin && reserva.idUsuarioCriador !== Number(idUsuario)) {
      return NextResponse.json(
        {
          success: false,
          error: "Você não tem permissão para deletar esta reserva.",
        },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("Reserva")
      .delete()
      .eq("idReserva", idReserva);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { message: "Reserva deletada com sucesso." },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
