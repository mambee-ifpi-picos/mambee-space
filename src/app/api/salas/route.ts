import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Token ausente. Faça login pelo Google e envie o token no header Authorization.",
      },
      { status: 401 }
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json(
      {
        error:
          "Token inválido ou sessão expirada. Faça login novamente pelo Google.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { nomeSala, mapa, limiteHorasReserva, ativa } = body;

    if (!nomeSala || !mapa || !limiteHorasReserva) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email: user.email! },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado no banco de dados." },
        { status: 404 }
      );
    }

    const novaSala = await prisma.sala.create({
      data: {
        nomeSala,
        mapa,
        limiteHorasReserva: Number(limiteHorasReserva),
        ativa: ativa ?? true,
        idUsuarioCriador: usuario.idUsuario,
      },
    });

    return NextResponse.json(
      { message: "Sala criada com sucesso!", sala: novaSala },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erro ao criar sala:", error.message);
    return NextResponse.json(
      { error: "Erro interno ao criar sala." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const salas = await prisma.sala.findMany({
      orderBy: { idSala: "desc" },
    });
    return NextResponse.json(salas, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao listar salas:", error.message);
    return NextResponse.json(
      { error: "Erro ao buscar salas." },
      { status: 500 }
    );
  }
}
