import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import AdminResultadoForm from "@/components/AdminResultadoForm";
import { getNomeTime, getFlagUrl } from "@/lib/times";

export default async function AdminJogosPage({
  searchParams,
}: {
  searchParams: Promise<{ rodada?: string; fase?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) redirect("/dashboard");

  const { rodada: rodadaParam, fase: faseParam } = await searchParams;
  const faseAtiva = faseParam ?? "grupos";
  const rodadaAtiva = Number(rodadaParam ?? 1);

  const jogos = await prisma.jogo.findMany({
    where: faseAtiva === "grupos"
      ? { fase: "Fase de Grupos", rodada: rodadaAtiva }
      : { fase: { not: "Fase de Grupos" } },
    orderBy: [{ grupo: "asc" }, { dataHora: "asc" }],
    include: { _count: { select: { palpites: true } } },
  });

  const totalJogos = await prisma.jogo.count();
  const encerrados = await prisma.jogo.count({ where: { encerrado: true } });
  const pendentes = await prisma.jogo.count({
    where: { encerrado: false, dataHora: { lt: new Date() } },
  });

  const grupos = [...new Set(jogos.map((j) => j.grupo ?? "?"))].sort();

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:opacity-75 text-gray-400">←</Link>
          <div>
            <h1 className="font-bold text-lg">Painel Admin</h1>
            <p className="text-gray-400 text-xs">Copa do Mundo 2026</p>
          </div>
        </div>
        <div className="flex gap-4 text-center text-sm">
          <div>
            <p className="font-bold text-white">{totalJogos}</p>
            <p className="text-gray-400 text-xs">Total</p>
          </div>
          <div>
            <p className="font-bold text-green-400">{encerrados}</p>
            <p className="text-gray-400 text-xs">Encerrados</p>
          </div>
          {pendentes > 0 && (
            <div>
              <p className="font-bold text-yellow-400">{pendentes}</p>
              <p className="text-gray-400 text-xs">Aguard. resultado</p>
            </div>
          )}
        </div>
      </header>

      {/* Abas de fase */}
      <div className="bg-gray-800 px-6 flex gap-1">
        {[
          { key: "grupos", label: "Fase de Grupos" },
          { key: "mata-mata", label: "Mata-mata" },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={`/admin/jogos?fase=${key}`}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
              faseAtiva === key
                ? "border-green-400 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Sub-abas de rodada (só na fase de grupos) */}
      {faseAtiva === "grupos" && (
        <div className="bg-white border-b flex max-w-full px-6 gap-1">
          {[1, 2, 3].map((r) => (
            <Link
              key={r}
              href={`/admin/jogos?fase=grupos&rodada=${r}`}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                rodadaAtiva === r
                  ? "border-green-600 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Rodada {r}
            </Link>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {jogos.length === 0 && (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
            Nenhum jogo nesta fase ainda.
          </div>
        )}

        {grupos.map((grupo) => {
          const jogosDoGrupo = jogos.filter((j) => (j.grupo ?? "?") === grupo);
          return (
            <section key={grupo}>
              {faseAtiva === "grupos" && (
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Grupo {grupo}
                </h2>
              )}
              <div className="bg-white rounded-xl border overflow-hidden divide-y">
                {jogosDoGrupo.map((jogo) => {
                  const dataHora = new Date(jogo.dataHora);
                  const jogado = dataHora < new Date();
                  return (
                    <div
                      key={jogo.id}
                      className={`p-4 ${jogo.encerrado ? "bg-gray-50" : jogado ? "bg-yellow-50" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status */}
                        <div className="w-24 shrink-0 text-center">
                          {jogo.encerrado ? (
                            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                              Encerrado
                            </span>
                          ) : jogado ? (
                            <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">
                              Aguardando
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {dataHora.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                              <br />
                              {dataHora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>

                        {/* Times */}
                        <div className="flex-1 flex items-center justify-center gap-3">
                          <span className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm flex-1 justify-end">
                            {getNomeTime(jogo.timeCasa)}
                            <Image src={getFlagUrl(jogo.timeCasa)} alt={jogo.timeCasa} width={24} height={17} className="rounded-sm border border-gray-200" unoptimized />
                          </span>

                          {jogo.encerrado ? (
                            <span className="text-xl font-bold text-gray-800 w-16 text-center">
                              {jogo.golsCasa} × {jogo.golsVisitante}
                            </span>
                          ) : (
                            <span className="text-gray-300 font-bold w-8 text-center">×</span>
                          )}

                          <span className="flex items-center gap-1.5 font-semibold text-gray-800 text-sm flex-1">
                            <Image src={getFlagUrl(jogo.timeVisitante)} alt={jogo.timeVisitante} width={24} height={17} className="rounded-sm border border-gray-200" unoptimized />
                            {getNomeTime(jogo.timeVisitante)}
                          </span>
                        </div>

                        {/* Palpites count */}
                        <div className="w-20 text-right shrink-0">
                          <span className="text-xs text-gray-400">
                            {jogo._count.palpites} palpite{jogo._count.palpites !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {!jogo.encerrado && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <AdminResultadoForm jogoId={jogo.id} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
