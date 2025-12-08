import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/salas/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const data = await req.json();

  const salaAtualizada = await prisma.sala.update({
    where: { idSala: id },
    data,
  });

  return NextResponse.json({
    success: true,
    data: { sala: salaAtualizada },
  });
}

// DELETE /api/salas/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  await prisma.sala.delete({
    where: { idSala: id },
  });

  return NextResponse.json({
    success: true,
    data: { message: "Sala deletada com sucesso!" },
  });
}
