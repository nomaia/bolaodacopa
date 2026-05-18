import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  return user?.isAdmin ?? false;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { timeCasa, timeVisitante, dataHora, fase, grupo } = await req.json();

  if (!timeCasa || !timeVisitante || !dataHora || !fase) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const jogo = await prisma.jogo.create({
    data: { timeCasa, timeVisitante, dataHora: new Date(dataHora), fase, grupo },
  });

  return NextResponse.json(jogo, { status: 201 });
}
