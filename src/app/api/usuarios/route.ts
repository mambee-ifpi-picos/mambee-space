import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const idsParam = url.searchParams.get("ids");
    let usuarios: any[] = [];

    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n));

      if (ids.length === 0) {
        return NextResponse.json(
          { success: false, error: "Parâmetro ids inválido." },
          { status: 400 }
        );
      }

      usuarios = await prisma.usuario.findMany({
        where: { idUsuario: { in: ids } },
      });
    } else {
      usuarios = await prisma.usuario.findMany();
    }

    return NextResponse.json({
      success: true,
      usuarios,
      data: { usuarios },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const usuario = await prisma.usuario.create({ data: payload });
    return NextResponse.json({ success: true, data: { usuario } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
