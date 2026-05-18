import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularPontos } from "@/lib/pontos";

async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isAdmin: true } });
  return user?.isAdmin ?? false;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { golsCasa, golsVisitante } = await req.json();

  if (golsCasa === undefined || golsVisitante === undefined) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const jogo = await prisma.jogo.update({
    where: { id },
    data: { golsCasa, golsVisitante, encerrado: true },
  });

  const palpites = await prisma.palpite.findMany({ where: { jogoId: id } });

  await Promise.all(
    palpites.map((p) => {
      const pontos = calcularPontos(
        { golsCasa: jogo.golsCasa!, golsVisitante: jogo.golsVisitante! },
        { golsCasa: p.golsCasaPalpite, golsVisitante: p.golsVisitantePalpite }
      );
      return prisma.palpite.update({ where: { id: p.id }, data: { pontos } });
    })
  );

  return NextResponse.json({ ok: true, palpitesAtualizados: palpites.length });
}
