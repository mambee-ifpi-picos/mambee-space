// biome-ignore lint/style/useImportType: <explanation>
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  try {
    const data = await req.json();
    const salaAtualizada = await prisma.sala.update({
      where: { idSala: id },
      data,
    });
    return NextResponse.json({ success: true, data: { sala: salaAtualizada } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao atualizar sala:", error.message);
    } else {
      console.error("Erro desconhecido ao atualizar sala:", error);
    }
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar sala." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  try {
    await prisma.sala.delete({ where: { idSala: id } });
    return NextResponse.json({
      success: true,
      data: { message: "Sala deletada com sucesso!" },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao deletar sala:", error.message);
    } else {
      console.error("Erro desconhecido ao deletar sala:", error);
    }
    return NextResponse.json(
      { success: false, error: "Erro ao deletar sala." },
      { status: 500 },
    );
  }
}
