import { createSupabaseServerClient } from "@/lib/supabase/server/supabaseServer";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UsuarioInfo {
  idUsuario: number;
  email: string;
  nome: string;
  admin: boolean;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idSala = url.searchParams.get("id");
    const search = url.searchParams.get("search");

    if (idSala) {
      const sala = await prisma.sala.findUnique({
        where: { idSala: Number(idSala) },
        include: { espacos: true },
      });

      const mappedSala = sala
        ? {
            ...sala,
            Espaco: sala.espacos,
            espacos: sala.espacos,
          }
        : null;

      return NextResponse.json({ success: true, salas: mappedSala ? [mappedSala] : [] });
    } else {
      const salas = await prisma.sala.findMany({
        where: search
          ? {
              nomeSala: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        include: { espacos: true },
      });

      const mappedSalas = salas.map((s: any) => ({
        ...s,
        Espaco: s.espacos,
        espacos: s.espacos,
      }));

      return NextResponse.json({ success: true, salas: mappedSalas });
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
      const usuarioData = await prisma.usuario.findFirst({
        where: { email: user.email ?? "" },
        select: { idUsuario: true, email: true, nome: true, admin: true },
      });

      if (usuarioData) {
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

      await prisma.sala.update({
        where: { idSala: Number(idSala) },
        data: {
          nomeSala: nomeSala.trim(),
          mapa: mapa.trim(),
          limiteHorasReserva: Number(limiteHorasReserva),
          ativa,
        },
      });

      console.log("Sala atualizada com sucesso.");

      if (espacos !== undefined) {
        console.log("Processando atualização de espaços...");

        try {
          const espacosExistentes = await prisma.espaco.findMany({
            where: { idSalaPertence: Number(idSala) },
            select: { idEspaco: true, codigoEspaco: true },
          });

          console.log("Espaços existentes no banco:", espacosExistentes?.length || 0);

          const espacosComReservas: number[] = [];

          if (espacosExistentes && espacosExistentes.length > 0) {
            for (const espaco of espacosExistentes) {
              const countReservas = await prisma.reserva.count({
                where: { idEspacoReservado: espaco.idEspaco },
              });

              if (countReservas > 0) {
                espacosComReservas.push(espaco.idEspaco);
                console.log(
                  `Espaço ${espaco.codigoEspaco} (ID: ${espaco.idEspaco}) tem reservas e NÃO pode ser deletado.`,
                );
              }
            }
          }

          console.log("Espaços com reservas (não podem ser deletados):", espacosComReservas.length);

          const espacosParaManterIds = new Set(espacosComReservas);
          const espacosParaDeletar = espacosExistentes.filter((esp: any) => !espacosParaManterIds.has(esp.idEspaco));

          console.log("Espaços que podem ser deletados:", espacosParaDeletar.length);

          if (espacosParaDeletar.length > 0) {
            const idsParaDeletar = espacosParaDeletar.map((esp: any) => esp.idEspaco);
            await prisma.espaco.deleteMany({
              where: { idEspaco: { in: idsParaDeletar } },
            });
            console.log(`${idsParaDeletar.length} espaços deletados com sucesso.`);
          }

          const espacosParaManter = espacosExistentes.filter((esp: any) => espacosParaManterIds.has(esp.idEspaco));

          console.log(
            "Espaços que serão mantidos (têm reservas):",
            espacosParaManter.map((e: any) => e.codigoEspaco),
          );

          const codigosExistentes = new Set(espacosParaManter.map((e: any) => e.codigoEspaco));
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
            const novosEspacos = espacosParaCriar.map((codigo: string) => {
              const espacoObj: any = {
                codigoEspaco: codigo,
                idSalaPertence: Number(idSala),
              };

              if (userId !== null) {
                espacoObj.idUsuarioCriador = userId;
              }

              return espacoObj;
            });

            console.log("Dados para criação de novos espaços:", novosEspacos);

            try {
              await prisma.espaco.createMany({
                data: novosEspacos,
                skipDuplicates: true,
              });
              console.log(`${novosEspacos.length} novos espaços criados.`);
            } catch (insertError) {
              console.error("Erro ao criar novos espaços:", insertError);
              const novosEspacosSemUsuario = espacosParaCriar.map((codigo: string) => ({
                codigoEspaco: codigo,
                idSalaPertence: Number(idSala),
              }));

              await prisma.espaco.createMany({
                data: novosEspacosSemUsuario,
                skipDuplicates: true,
              });
              console.log("Espaços criados sem idUsuarioCriador.");
            }
          }

          const codigosManterNaoNaLista = espacosParaManter
            .filter((e: any) => !codigosNovosRecebidos.has(e.codigoEspaco))
            .map((e: any) => e.codigoEspaco);

          if (codigosManterNaoNaLista.length > 0) {
            console.log("AVISO: Os seguintes espaços têm reservas e não foram removidos:", codigosManterNaoNaLista);
          }
        } catch (error) {
          console.error("Erro no processamento de espaços:", error);
        }
      }

      console.log("ATUALIZAÇÃO FINALIZADA");
      return NextResponse.json({ success: true });
    } else {
      console.log("CRIANDO NOVA SALA");

      if (userId === null) {
        return NextResponse.json({ success: false, error: "Usuário criador não identificado." }, { status: 400 });
      }

      const novaSala = await prisma.sala.create({
        data: {
          nomeSala: nomeSala.trim(),
          mapa: mapa.trim(),
          limiteHorasReserva: Number(limiteHorasReserva),
          ativa,
          idUsuarioCriador: userId,
        },
      });

      console.log("Nova sala criada. ID:", novaSala.idSala);

      if (espacos && espacos.length > 0) {
        const espacosValidos = espacos
          .map((codigo: string) => codigo?.toString().trim())
          .filter((codigo: string) => codigo !== "");

        if (espacosValidos.length > 0) {
          const novosEspacos = espacosValidos.map((codigo: string) => {
            const espacoObj: any = {
              codigoEspaco: codigo,
              idSalaPertence: novaSala.idSala,
            };

            if (userId !== null) {
              espacoObj.idUsuarioCriador = userId;
            }

            return espacoObj;
          });

          try {
            await prisma.espaco.createMany({
              data: novosEspacos,
              skipDuplicates: true,
            });
          } catch (insertEspError) {
            console.error("Erro ao inserir espaços na nova sala:", insertEspError);

            const novosEspacosSemUsuario = espacosValidos.map((codigo: string) => ({
              codigoEspaco: codigo,
              idSalaPertence: novaSala.idSala,
            }));

            await prisma.espaco.createMany({
              data: novosEspacosSemUsuario,
              skipDuplicates: true,
            });
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
