import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";
import { NextResponse } from "next/server";
import { PostgrestError } from "@supabase/supabase-js";

interface EspacoInsert {
  codigoEspaco: string;
  idSalaPertence: number;
  idUsuarioCriador?: number;
}

interface UsuarioInfo {
  idUsuario: number;
  email: string;
  nome: string;
  admin: boolean;
}

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const url = new URL(req.url);
    const idSala = url.searchParams.get("id");
    const search = url.searchParams.get("search");

    let data: any;
    let error: PostgrestError | null = null;

    if (idSala) {
      ({ data, error } = await supabase.from("Sala").select(`*, Espaco(*)`).eq("idSala", idSala).single());

      return NextResponse.json({ success: true, salas: data ? [data] : [] });
    } else {
      let query = supabase.from("Sala").select(`*, Espaco(*)`);
      if (search) query = query.ilike("nomeSala", `%${search}%`);

      ({ data, error } = await query);

      if (error) return NextResponse.json({ success: false, error: "Erro ao carregar salas" }, { status: 400 });

      return NextResponse.json({ success: true, salas: data || [] });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Erro interno." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ success: false, error: "Usuário não autenticado." }, { status: 401 });

    let isAdmin = false;
    let usuarioInfo: UsuarioInfo | null = null;

    try {
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("Usuario")
        .select("idUsuario, email, nome, admin")
        .eq("email", user.email)
        .maybeSingle();

      if (usuarioError) {
        console.error("Erro ao buscar usuário:", usuarioError);
      } else if (usuarioData) {
        usuarioInfo = {
          idUsuario: usuarioData.idUsuario,
          email: usuarioData.email,
          nome: usuarioData.nome,
          admin: usuarioData.admin || false,
        };
        isAdmin = usuarioInfo.admin;

        console.log("Informações do usuário:", {
          ...usuarioInfo,
          isAdmin,
        });
      }
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Acesso negado. Apenas administradores podem criar ou editar salas.",
        },
        { status: 403 },
      );
    }

    const { idSala, nomeSala, mapa, limiteHorasReserva, ativa, espacos } = await req.json();

    if (!nomeSala || !mapa || !limiteHorasReserva)
      return NextResponse.json(
        {
          success: false,
          error: "Campos obrigatórios ausentes.",
        },
        { status: 400 },
      );

    const userId = usuarioInfo?.idUsuario || null;

    if (idSala) {
      console.log("ATUALIZANDO SALA EXISTENTE");

      const { error: updateError } = await supabase
        .from("Sala")
        .update({
          nomeSala: nomeSala.trim(),
          mapa: mapa.trim(),
          limiteHorasReserva: Number(limiteHorasReserva),
          ativa,
          exigeProjeto: true,
        })
        .eq("idSala", idSala);

      if (updateError) {
        console.error("Erro ao atualizar sala:", updateError);
        return NextResponse.json({ success: false, error: "Erro ao atualizar sala." }, { status: 400 });
      }

      console.log("Sala atualizada com sucesso.");

      if (espacos !== undefined) {
        console.log("Processando atualização de espaços...");

        try {
          const { data: espacosExistentes, error: fetchError } = await supabase
            .from("Espaco")
            .select("idEspaco, codigoEspaco")
            .eq("idSalaPertence", idSala);

          if (fetchError) {
            console.error("Erro ao buscar espaços existentes:", fetchError);
          } else {
            console.log("Espaços existentes no banco:", espacosExistentes?.length || 0);

            const espacosComReservas: number[] = [];

            if (espacosExistentes && espacosExistentes.length > 0) {
              for (const espaco of espacosExistentes) {
                const { data: reservas, error: reservasError } = await supabase
                  .from("Reserva")
                  .select("idReserva")
                  .eq("idEspacoReservado", espaco.idEspaco)
                  .limit(1);

                if (!reservasError && reservas && reservas.length > 0) {
                  espacosComReservas.push(espaco.idEspaco);
                  console.log(
                    `Espaço ${espaco.codigoEspaco} (ID: ${espaco.idEspaco}) tem reservas e NÃO pode ser deletado.`,
                  );
                }
              }
            }

            console.log("Espaços com reservas (não podem ser deletados):", espacosComReservas.length);

            const espacosParaManterIds = new Set(espacosComReservas);
            const espacosParaDeletar =
              espacosExistentes?.filter((esp) => !espacosParaManterIds.has(esp.idEspaco)) || [];

            console.log("Espaços que podem ser deletados:", espacosParaDeletar.length);

            if (espacosParaDeletar.length > 0) {
              const idsParaDeletar = espacosParaDeletar.map((esp) => esp.idEspaco);
              const { error: deleteError } = await supabase.from("Espaco").delete().in("idEspaco", idsParaDeletar);

              if (deleteError) {
                console.error("Erro ao deletar espaços:", deleteError);
              } else {
                console.log(`${idsParaDeletar.length} espaços deletados com sucesso.`);
              }
            }

            const espacosParaManter = espacosExistentes?.filter((esp) => espacosParaManterIds.has(esp.idEspaco)) || [];

            console.log(
              "Espaços que serão mantidos (têm reservas):",
              espacosParaManter.map((e) => e.codigoEspaco),
            );

            const codigosExistentes = new Set(espacosParaManter.map((e) => e.codigoEspaco));
            const codigosNovosRecebidos = new Set(
              Array.isArray(espacos)
                ? espacos.map((c: string) => c?.toString().trim()).filter((c: string) => c !== "")
                : [],
            );

            const espacosParaCriar = Array.from(codigosNovosRecebidos).filter(
              (codigo: string) => !codigosExistentes.has(codigo),
            );

            console.log("Espaços novos para criar:", espacosParaCriar);

            if (espacosParaCriar.length > 0) {
              const novosEspacos: EspacoInsert[] = espacosParaCriar.map((codigo: string) => {
                const espacoObj: EspacoInsert = {
                  codigoEspaco: codigo,
                  idSalaPertence: idSala,
                };

                if (userId !== null) {
                  espacoObj.idUsuarioCriador = userId;
                }

                return espacoObj;
              });

              console.log("Dados para criação de novos espaços:", novosEspacos);

              const { error: insertError } = await supabase.from("Espaco").insert(novosEspacos);

              if (insertError) {
                console.error("Erro ao criar novos espaços:", insertError);

                const novosEspacosSemUsuario: EspacoInsert[] = espacosParaCriar.map((codigo: string) => ({
                  codigoEspaco: codigo,
                  idSalaPertence: idSala,
                }));

                const { error: insertError2 } = await supabase.from("Espaco").insert(novosEspacosSemUsuario);

                if (insertError2) {
                  console.error("Erro mesmo sem idUsuarioCriador:", insertError2);
                } else {
                  console.log("Espaços criados sem idUsuarioCriador.");
                }
              } else {
                console.log(`${novosEspacos.length} novos espaços criados.`);
              }
            }

            const codigosManterNaoNaLista = espacosParaManter
              .filter((e) => !codigosNovosRecebidos.has(e.codigoEspaco))
              .map((e) => e.codigoEspaco);

            if (codigosManterNaoNaLista.length > 0) {
              console.log("AVISO: Os seguintes espaços têm reservas e não foram removidos:", codigosManterNaoNaLista);
            }
          }
        } catch (error) {
          console.error("Erro no processamento de espaços:", error);
        }
      }

      console.log("ATUALIZAÇÃO FINALIZADA");
      return NextResponse.json({ success: true });
    } else {
      console.log("CRIANDO NOVA SALA");

      const { data: novaSala, error: insertError } = await supabase
        .from("Sala")
        .insert({
          nomeSala: nomeSala.trim(),
          mapa: mapa.trim(),
          limiteHorasReserva: Number(limiteHorasReserva),
          ativa,
          exigeProjeto: true,
          idUsuarioCriador: userId,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao criar sala:", insertError);
        return NextResponse.json({ success: false, error: "Erro ao criar sala." }, { status: 400 });
      }

      console.log("Nova sala criada. ID:", novaSala.idSala);

      if (espacos && espacos.length > 0) {
        const espacosValidos = espacos
          .map((codigo: string) => codigo?.toString().trim())
          .filter((codigo: string) => codigo !== "");

        if (espacosValidos.length > 0) {
          const novosEspacos: EspacoInsert[] = espacosValidos.map((codigo: string) => {
            const espacoObj: EspacoInsert = {
              codigoEspaco: codigo,
              idSalaPertence: novaSala.idSala,
            };

            if (userId !== null) {
              espacoObj.idUsuarioCriador = userId;
            }

            return espacoObj;
          });

          const { error: insertEspError } = await supabase.from("Espaco").insert(novosEspacos);

          if (insertEspError) {
            console.error("Erro ao inserir espaços na nova sala:", insertEspError);

            const novosEspacosSemUsuario: EspacoInsert[] = espacosValidos.map((codigo: string) => ({
              codigoEspaco: codigo,
              idSalaPertence: novaSala.idSala,
            }));

            const { error: insertError2 } = await supabase.from("Espaco").insert(novosEspacosSemUsuario);

            if (insertError2) {
              console.error("Erro mesmo sem idUsuarioCriador:", insertError2);
            }
          }
        }
      }

      return NextResponse.json({ success: true });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false, error: "Erro interno." }, { status: 500 });
  }
}
