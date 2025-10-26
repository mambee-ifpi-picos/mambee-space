import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idUsuario = searchParams.get("idUsuario");

    if (!idUsuario) {
      return NextResponse.json(
        { success: false, error: "Informe o ID do usuário." },
        { status: 400 }
      );
    }

    const { data: usuario, error: erroUsuario } = await supabase
      .from("Usuario")
      .select("admin")
      .eq("idUsuario", idUsuario)
      .single();

    if (erroUsuario) throw erroUsuario;

    let query = supabase
      .from("Reserva")
      .select("*, espaco(codigoEspaco, sala(nomeSala))");

    if (!usuario?.admin) {
      query = query.eq("idUsuarioCriador", idUsuario);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, reservas: data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      motivo: string;
      horaInicio: string;
      horaFim: string;
      idUsuarioCriador: number;
      idEspacoReservado: number;
    };

    const { motivo, horaInicio, horaFim, idUsuarioCriador, idEspacoReservado } =
      body;

    if (
      !motivo ||
      !horaInicio ||
      !horaFim ||
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
      .select("idEspaco, sala(ativa)")
      .eq("idEspaco", idEspacoReservado)
      .single();

    if (erroEspaco) throw erroEspaco;

    if (!espaco) {
      return NextResponse.json(
        { success: false, error: "Espaço não encontrado." },
        { status: 404 }
      );
    }

    const salaAtiva = Array.isArray(espaco.sala)
      ? espaco.sala[0]?.ativa
      : (espaco.sala as { ativa: boolean } | null)?.ativa;

    if (!salaAtiva) {
      return NextResponse.json(
        { success: false, error: "A sala deste espaço está inativa." },
        { status: 403 }
      );
    }

    const inicio = new Date(horaInicio).getTime();
    const fim = new Date(horaFim).getTime();
    const duracaoHoras = (fim - inicio) / (1000 * 60 * 60);

    if (duracaoHoras > 4) {
      return NextResponse.json(
        { success: false, error: "O limite máximo de reserva é de 4 horas." },
        { status: 400 }
      );
    }

    const { data: conflitos, error: erroConflito } = await supabase
      .from("Reserva")
      .select("idReserva, horaInicio, horaFim")
      .eq("idEspacoReservado", idEspacoReservado)
      .or(`and(horaInicio.lt.${horaFim},horaFim.gt.${horaInicio})`);

    if (erroConflito) throw erroConflito;

    if (conflitos && conflitos.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Já existe uma reserva nesse horário para este espaço.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("Reserva")
      .insert([
        {
          motivo,
          horaInicio,
          horaFim,
          situacao: "Pendente",
          idUsuarioCriador,
          idEspacoReservado,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reserva: data[0],
      message: "Reserva criada com sucesso.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
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

    if (!reservaExistente) {
      return NextResponse.json(
        { success: false, error: "Reserva não encontrada." },
        { status: 404 }
      );
    }

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
          { success: false, error: "O limite máximo de reserva é de 4 horas." },
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

      if (conflitos && conflitos.length > 0) {
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

    return NextResponse.json({
      success: true,
      reserva: data[0],
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
      message: "Reserva deletada com sucesso.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
