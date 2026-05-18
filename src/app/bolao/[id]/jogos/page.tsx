import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import JogoCard from "@/components/JogoCard";

const GRUPO_CORES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  A: { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   badge: "bg-blue-600" },
  B: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-600" },
  C: { bg: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700",badge: "bg-emerald-600" },
  D: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-600" },
  E: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", badge: "bg-purple-600" },
  F: { bg: "bg-pink-50",   border: "border-pink-200",   text: "text-pink-700",   badge: "bg-pink-600" },
  G: { bg: "bg-teal-50",   border: "border-teal-200",   text: "text-teal-700",   badge: "bg-teal-600" },
  H: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-500" },
  I: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-600" },
  J: { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-700",   badge: "bg-rose-600" },
  K: { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  badge: "bg-amber-500" },
  L: { bg: "bg-cyan-50",   border: "border-cyan-200",   text: "text-cyan-700",   badge: "bg-cyan-600" },
};

const COR_PADRAO = { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", badge: "bg-gray-500" };

export default async function BolaoJogosPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rodada?: string }>;
}) {
  const { id } = await params;
  const { rodada: rodadaParam } = await searchParams;
  const rodadaAtiva = Number(rodadaParam ?? "1");

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bolao = await prisma.bolao.findUnique({ where: { id } });
  if (!bolao) notFound();

  const participa = await prisma.participante.findUnique({
    where: { userId_bolaoId: { userId: session.user.id, bolaoId: id } },
  });
  if (!participa) redirect("/dashboard");

  const [jogos, palpitesUsuario] = await Promise.all([
    prisma.jogo.findMany({
      where: { fase: "Fase de Grupos", rodada: rodadaAtiva },
      orderBy: [{ grupo: "asc" }, { dataHora: "asc" }],
    }),
    prisma.palpite.findMany({
      where: { userId: session.user.id, bolaoId: id },
      select: { jogoId: true, golsCasaPalpite: true, golsVisitantePalpite: true, pontos: true },
    }),
  ]);

  const palpiteMap = Object.fromEntries(palpitesUsuario.map((p) => [p.jogoId, p]));

  const grupos = [...new Set(jogos.map((j) => j.grupo ?? "?"))].sort();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href={`/bolao/${id}`} className="hover:opacity-75">←</Link>
        <div>
          <h1 className="font-bold text-lg">Palpites</h1>
          <p className="text-green-200 text-sm">{bolao.nome}</p>
        </div>
      </header>

      {/* Abas de rodada */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex">
          {[1, 2, 3].map((r) => (
            <Link
              key={r}
              href={`/bolao/${id}/jogos?rodada=${r}`}
              className={`flex-1 text-center py-3 text-sm font-semibold border-b-2 transition ${
                rodadaAtiva === r
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Rodada {r}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {jogos.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400 mt-4">
            Jogos desta rodada ainda não foram publicados.
          </div>
        )}

        {grupos.map((grupo) => {
          const cor = GRUPO_CORES[grupo] ?? COR_PADRAO;
          const jogosDoGrupo = jogos.filter((j) => (j.grupo ?? "?") === grupo);

          return (
            <section key={grupo}>
              <div className={`flex items-center gap-2 mb-2`}>
                <span className={`${cor.badge} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                  Grupo {grupo}
                </span>
              </div>
              <div className={`rounded-xl border ${cor.border} ${cor.bg} p-3 space-y-2`}>
                {jogosDoGrupo.map((jogo) => (
                  <JogoCard
                    key={jogo.id}
                    jogo={jogo}
                    palpite={palpiteMap[jogo.id] ?? null}
                    bolaoId={id}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
