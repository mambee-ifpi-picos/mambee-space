import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const data = await req.json();

    const salaAtualizada = await prisma.sala.update({
      where: { idSala: id },
      data,
    });

    return NextResponse.json({
      message: "Sala atualizada com sucesso!",
      sala: salaAtualizada,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar sala:", error.message);
    return NextResponse.json(
      { error: "Erro ao atualizar sala." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    await prisma.sala.delete({ where: { idSala: id } });
    return NextResponse.json({ message: "Sala deletada com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao deletar sala:", error.message);
    return NextResponse.json(
      { error: "Erro ao deletar sala." },
      { status: 500 }
    );
  }
}
