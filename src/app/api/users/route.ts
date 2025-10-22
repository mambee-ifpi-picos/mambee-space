//api/users/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const usuarios = await prisma.usuario.findMany();
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const json = await request.json();
  console.log(json);
  const usuario = await prisma.usuario.create({
    data: json,
  });
  return NextResponse.json(usuario);
}
