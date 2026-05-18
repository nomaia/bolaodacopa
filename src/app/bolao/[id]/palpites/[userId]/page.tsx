import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { getNomeTime, getFlagUrl } from "@/lib/times";

function badgePontos(pontos: number) {
  if (pontos === 10) return { bg: "bg-yellow-400", text: "text-yellow-900", label: "⭐ 10 pts" };
  if (pontos === 6)  return { bg: "bg-green-500",  text: "text-white",      label: "✓ 6 pts" };
  if (pontos === 5)  return { bg: "bg-blue-500",   text: "text-white",      label: "✓ 5 pts" };
  return               { bg: "bg-gray-200",      text: "text-gray-600",   label: "✗ 0 pts" };
}

export default async function PalpitesUsuarioPage({
  params,
}: {
  params: Promise<{ id: string; userId: string }>;
}) {
  const { id: bolaoId, userId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bolao = await prisma.bolao.findUnique({ where: { id: bolaoId } });
  if (!bolao) notFound();

  // Verificar que o usuário logado participa do bolão
  const participa = await prisma.participante.findUnique({
    where: { userId_bolaoId: { userId: session.user.id, bolaoId } },
  });
  if (!participa) redirect("/dashboard");

  // Buscar o dono dos palpites
  const alvo = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });
  if (!alvo) notFound();

  // Verificar que o alvo também participa do bolão
  const alvoParticipa = await prisma.participante.findUnique({
    where: { userId_bolaoId: { userId, bolaoId } },
  });
  if (!alvoParticipa) notFound();

  // Cutoff: agora + 30min — jogos cujo dataHora < esse valor já estão bloqueados
  const cutoffAgora = new Date(Date.now() + 30 * 60 * 1000);

  const palpites = await prisma.palpite.findMany({
    where: {
      bolaoId,
      userId,
      jogo: { dataHora: { lt: cutoffAgora } },
    },
    include: {
      jogo: {
        select: {
          id: true,
          timeCasa: true,
          timeVisitante: true,
          dataHora: true,
          golsCasa: true,
          golsVisitante: true,
          encerrado: true,
          grupo: true,
        },
      },
    },
    orderBy: { jogo: { dataHora: "asc" } },
  });

  const ehVoce = userId === session.user.id;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href={`/bolao/${bolaoId}/ranking`} className="hover:opacity-75">←</Link>
        <div>
          <h1 className="font-bold text-lg">
            {ehVoce ? "Seus palpites" : `Palpites de ${alvo.name}`}
          </h1>
          <p className="text-green-200 text-sm">{bolao.nome}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-3">
        {palpites.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            <p>Nenhum palpite visível ainda.</p>
            <p className="text-sm mt-1">Os palpites aparecem após o prazo de cada jogo (30 min antes).</p>
          </div>
        )}

        {palpites.map(({ jogo, golsCasaPalpite, golsVisitantePalpite, pontos }) => {
          const badge = jogo.encerrado && pontos !== null ? badgePontos(pontos) : null;
          const dataHora = new Date(jogo.dataHora);

          return (
            <div key={jogo.id} className="bg-white rounded-xl border p-4">
              {/* Grupo + data */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span>{jogo.grupo ? `Grupo ${jogo.grupo}` : jogo.encerrado ? "Encerrado" : ""}</span>
                <span>
                  {dataHora.toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Times */}
              <div className="flex items-center gap-3">
                <span className="flex-1 flex items-center justify-end gap-2 font-semibold text-gray-800 text-sm">
                  {getNomeTime(jogo.timeCasa)}
                  <Image src={getFlagUrl(jogo.timeCasa)} alt={jogo.timeCasa} width={24} height={17} className="rounded-sm border border-gray-200" unoptimized />
                </span>

                <div className="text-center min-w-[72px]">
                  <span className="text-xl font-bold text-green-700">
                    {golsCasaPalpite} <span className="text-gray-300">×</span> {golsVisitantePalpite}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">palpite</p>
                </div>

                <span className="flex-1 flex items-center gap-2 font-semibold text-gray-800 text-sm">
                  <Image src={getFlagUrl(jogo.timeVisitante)} alt={jogo.timeVisitante} width={24} height={17} className="rounded-sm border border-gray-200" unoptimized />
                  {getNomeTime(jogo.timeVisitante)}
                </span>
              </div>

              {/* Resultado oficial + pontos */}
              {jogo.encerrado && (
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Resultado: <span className="font-semibold text-gray-700">
                      {jogo.golsCasa} × {jogo.golsVisitante}
                    </span>
                  </span>
                  {badge && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              )}

              {!jogo.encerrado && (
                <p className="mt-2 text-[11px] text-gray-400 text-center italic">Aguardando resultado</p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
