import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { codigo } = await req.json();
  if (!codigo?.trim()) {
    return NextResponse.json({ error: "Código obrigatório." }, { status: 400 });
  }

  const bolao = await prisma.bolao.findUnique({ where: { codigo: codigo.trim().toUpperCase() } });
  if (!bolao) {
    return NextResponse.json({ error: "Bolão não encontrado." }, { status: 404 });
  }

  const jaParticipa = await prisma.participante.findUnique({
    where: { userId_bolaoId: { userId: session.user.id, bolaoId: bolao.id } },
  });

  if (jaParticipa) {
    return NextResponse.json({ bolaoId: bolao.id });
  }

  await prisma.participante.create({
    data: { userId: session.user.id, bolaoId: bolao.id },
  });

  return NextResponse.json({ bolaoId: bolao.id });
}
