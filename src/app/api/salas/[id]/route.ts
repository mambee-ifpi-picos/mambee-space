// biome-ignore lint/style/useImportType: <explanation>
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const prisma = new PrismaClient();

export async function PUT() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

   useEffect(() => {
    if (!id) return

    fetch('/api/salas', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id}),
    })
      .then(res => res.json())
      .then(data => console.log(data))
  }, [id])
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { [id: string]: string } }
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
