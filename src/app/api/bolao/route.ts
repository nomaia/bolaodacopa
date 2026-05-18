import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { nome, descricao, publico } = await req.json();
  if (!nome?.trim()) {
    return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
  }

  const codigo = nanoid(6).toUpperCase();

  const bolao = await prisma.bolao.create({
    data: {
      nome: nome.trim(),
      descricao: descricao?.trim() || null,
      publico: publico ?? true,
      codigo,
      criadorId: session.user.id,
      participantes: {
        create: { userId: session.user.id },
      },
    },
  });

  return NextResponse.json({ id: bolao.id, codigo: bolao.codigo }, { status: 201 });
}
