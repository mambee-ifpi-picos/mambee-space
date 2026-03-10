import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idAuth = searchParams.get("idAuth");

    if (!idAuth) {
      return NextResponse.json({ error: "idAuth não fornecido" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idAuth },
      select: {
        idUsuario: true,
        nome: true,
        email: true,
        admin: true,
        foto: true,
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro em /api/usuarios/me:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
