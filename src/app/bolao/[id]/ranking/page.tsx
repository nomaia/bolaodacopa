import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RankingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bolao = await prisma.bolao.findUnique({
    where: { id },
    include: {
      participantes: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              palpites: {
                where: { pontos: { not: null }, bolaoId: id },
                select: { pontos: true },
              },
            },
          },
        },
      },
    },
  });

  if (!bolao) notFound();

  const participa = bolao.participantes.some((p) => p.userId === session.user.id);
  if (!participa) redirect("/dashboard");

  const ranking = bolao.participantes
    .map(({ user }) => ({
      id: user.id,
      name: user.name,
      pontos: user.palpites.reduce((acc, p) => acc + (p.pontos ?? 0), 0),
      acertos: user.palpites.filter((p) => (p.pontos ?? 0) > 0).length,
    }))
    .sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href={`/bolao/${id}`} className="hover:opacity-75">←</Link>
        <div>
          <h1 className="font-bold text-lg">Ranking</h1>
          <p className="text-green-200 text-sm">{bolao.nome}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6">
        <ul className="space-y-2">
          {ranking.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-4 bg-white rounded-xl border px-4 py-3 ${p.id === session.user.id ? "border-green-400 ring-1 ring-green-400" : ""}`}
            >
              <span className={`text-lg font-bold w-7 text-center ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-400"}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <Link
                  href={`/bolao/${id}/palpites/${p.id}`}
                  className="font-semibold text-gray-800 hover:text-green-700 transition"
                >
                  {p.name} {p.id === session.user.id && <span className="text-xs text-green-600">(você)</span>}
                </Link>
                <p className="text-xs text-gray-400">{p.acertos} jogo{p.acertos !== 1 ? "s" : ""} pontuado{p.acertos !== 1 ? "s" : ""}</p>
              </div>
              <span className="text-xl font-bold text-green-700">{p.pontos} <span className="text-sm font-normal text-gray-400">pts</span></span>
            </li>
          ))}
        </ul>

        {ranking.length === 0 && (
          <div className="text-center text-gray-400 py-12">Nenhum palpite pontuado ainda.</div>
        )}
      </div>
    </main>
  );
}
