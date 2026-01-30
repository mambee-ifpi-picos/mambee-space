import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const idProjeto = parseInt(params.id);
    const url = new URL(request.url);
    const includeParticipacoes = url.searchParams.get("include") === "participacoes";

    if (isNaN(idProjeto)) {
      return NextResponse.json({ error: "ID do projeto inválido" }, { status: 400 });
    }

    if (includeParticipacoes) {
      // Buscar projeto com participações detalhadas
      const projeto = await prisma.projeto.findUnique({
        where: { idProjeto },
        include: {
          criador: {
            select: { 
              idUsuario: true,
              nome: true, 
              foto: true,
              email: true 
            },
          },
          participacoes: {
            include: {
              usuario: {
                select: {
                  idUsuario: true,
                  nome: true,
                  email: true,
                  foto: true,
                },
              },
              admin: {
                select: {
                  idUsuario: true,
                  nome: true,
                  email: true,
                },
              },
            },
            orderBy: {
              situacao: 'desc', // Ordena por situação (Autorizado primeiro)
            },
          },
        },
      });

      if (!projeto) {
        return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
      }

      // Transformar os dados para o formato esperado pelo frontend
      const projetoFormatado = {
        ...projeto,
        dataInicio: projeto.dataInicio.toISOString(),
        dataFim: projeto.dataFim ? projeto.dataFim.toISOString() : null,
        participacoes: projeto.participacoes.map((p: { idParticipa: any; motivo: any; situacao: any; motivoSituacao: any; usuario: { idUsuario: any; nome: any; email: any; foto: any; }; admin: { idUsuario: any; nome: any; email: any; }; }) => ({
          idParticipa: p.idParticipa,
          motivo: p.motivo,
          situacao: p.situacao,
          motivoSituacao: p.motivoSituacao,
          usuario: {
            idUsuario: p.usuario.idUsuario,
            nome: p.usuario.nome,
            email: p.usuario.email,
            foto: p.usuario.foto,
          },
          admin: p.admin ? {
            idUsuario: p.admin.idUsuario,
            nome: p.admin.nome,
            email: p.admin.email,
          } : undefined,
        })),
      };

      return NextResponse.json(projetoFormatado);
    } else {
      // Buscar apenas informações básicas do projeto
      const projeto = await prisma.projeto.findUnique({
        where: { idProjeto },
        include: {
          criador: {
            select: { 
              idUsuario: true,
              nome: true, 
              foto: true,
              email: true 
            },
          },
        },
      });

      if (!projeto) {
        return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
      }

      const projetoFormatado = {
        ...projeto,
        dataInicio: projeto.dataInicio.toISOString(),
        dataFim: projeto.dataFim ? projeto.dataFim.toISOString() : null,
      };

      return NextResponse.json(projetoFormatado);
    }
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}