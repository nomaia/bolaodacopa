import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { jogoId, bolaoId, golsCasaPalpite, golsVisitantePalpite } = await req.json();

  if (!jogoId || !bolaoId || golsCasaPalpite === undefined || golsVisitantePalpite === undefined) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const participa = await prisma.participante.findUnique({
    where: { userId_bolaoId: { userId: session.user.id, bolaoId } },
  });
  if (!participa) {
    return NextResponse.json({ error: "Você não participa deste bolão." }, { status: 403 });
  }

  const jogo = await prisma.jogo.findUnique({ where: { id: jogoId } });
  if (!jogo) return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
  if (jogo.encerrado) return NextResponse.json({ error: "Jogo já encerrado." }, { status: 400 });
  const cutoff = new Date(jogo.dataHora.getTime() - 30 * 60 * 1000);
  if (new Date() >= cutoff) {
    return NextResponse.json({ error: "Prazo para palpitar encerrado (30 min antes do jogo)." }, { status: 400 });
  }

  const palpite = await prisma.palpite.upsert({
    where: { userId_jogoId_bolaoId: { userId: session.user.id, jogoId, bolaoId } },
    create: { userId: session.user.id, jogoId, bolaoId, golsCasaPalpite, golsVisitantePalpite },
    update: { golsCasaPalpite, golsVisitantePalpite },
  });

  return NextResponse.json(palpite);
}
