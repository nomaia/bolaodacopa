import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { signOut } from "@/lib/auth";
import { getNomeTime } from "@/lib/times";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  const participacoes = await prisma.participante.findMany({
    where: { userId: session.user.id },
    include: {
      bolao: {
        include: { _count: { select: { participantes: true } } },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const bolaoIds = participacoes.map((p) => p.bolaoId);

  // Próximo jogo com prazo aberto que o usuário ainda não palpitou (em qualquer bolão)
  const agora = new Date();
  const cutoffAgora = new Date(agora.getTime() + 30 * 60 * 1000);

  let proximoJogoPendente: {
    id: string;
    timeCasa: string;
    timeVisitante: string;
    dataHora: Date;
    bolaoId: string;
    bolaoNome: string;
  } | null = null;

  if (bolaoIds.length > 0) {
    // Pega palpites já dados pelo usuário
    const palpitesDados = await prisma.palpite.findMany({
      where: { userId: session.user.id, bolaoId: { in: bolaoIds } },
      select: { jogoId: true, bolaoId: true },
    });
    const palpitesSet = new Set(palpitesDados.map((p) => `${p.jogoId}-${p.bolaoId}`));

    // Próximos jogos com prazo aberto
    const proximosJogos = await prisma.jogo.findMany({
      where: { encerrado: false, dataHora: { gt: cutoffAgora } },
      orderBy: { dataHora: "asc" },
      take: 20,
    });

    for (const jogo of proximosJogos) {
      for (const { bolaoId, bolao } of participacoes) {
        if (!palpitesSet.has(`${jogo.id}-${bolaoId}`)) {
          proximoJogoPendente = {
            id: jogo.id,
            timeCasa: jogo.timeCasa,
            timeVisitante: jogo.timeVisitante,
            dataHora: jogo.dataHora,
            bolaoId,
            bolaoNome: bolao.nome,
          };
          break;
        }
      }
      if (proximoJogoPendente) break;
    }
  }

  const primeiroNome = session.user.name?.split(" ")[0] ?? "você";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="font-bold text-lg">Bolão da Copa</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-200">Olá, {primeiroNome}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-sm border border-white px-3 py-1 rounded hover:bg-white hover:text-green-700 transition">
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {/* Admin */}
        {user?.isAdmin && (
          <Link
            href="/admin/jogos"
            className="block w-full bg-gray-800 text-white text-center font-semibold py-3 rounded-xl hover:bg-gray-700 transition text-sm"
          >
            ⚙ Painel Admin — Lançar resultados
          </Link>
        )}

        {/* Card contextual */}
        {participacoes.length === 0 ? (
          <div className="bg-green-700 text-white rounded-2xl p-5 space-y-3">
            <p className="font-bold text-lg">Bem-vindo ao Bolão da Copa! 🎉</p>
            <p className="text-green-100 text-sm">
              Você ainda não está em nenhum bolão. Para começar, crie o seu próprio ou peça o código para um amigo e entre no bolão dele.
            </p>
            <div className="flex gap-2 pt-1">
              <Link href="/bolao/novo" className="flex-1 bg-yellow-400 text-green-900 font-bold text-sm text-center py-2 rounded-lg hover:bg-yellow-300 transition">
                Criar bolão
              </Link>
              <Link href="/bolao/entrar" className="flex-1 border-2 border-white text-white font-bold text-sm text-center py-2 rounded-lg hover:bg-white hover:text-green-700 transition">
                Entrar com código
              </Link>
            </div>
          </div>
        ) : proximoJogoPendente ? (
          <div className="bg-green-700 text-white rounded-2xl p-5">
            <p className="text-green-200 text-xs font-medium uppercase tracking-wide mb-1">Palpite pendente</p>
            <p className="font-bold text-lg">
              {getNomeTime(proximoJogoPendente.timeCasa)} × {getNomeTime(proximoJogoPendente.timeVisitante)}
            </p>
            <p className="text-green-200 text-sm mt-0.5">
              {new Date(proximoJogoPendente.dataHora).toLocaleString("pt-BR", {
                day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
              })} · {proximoJogoPendente.bolaoNome}
            </p>
            <Link
              href={`/bolao/${proximoJogoPendente.bolaoId}/jogos`}
              className="mt-3 inline-block bg-yellow-400 text-green-900 font-bold text-sm px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Dar palpite →
            </Link>
          </div>
        ) : (
          <div className="bg-green-700 text-white rounded-2xl p-5">
            <p className="font-bold text-lg">Tudo em dia! ✓</p>
            <p className="text-green-200 text-sm mt-1">
              Você já palpitou em todos os jogos disponíveis. Acompanhe o ranking e torça!
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-3">
          <Link
            href="/bolao/novo"
            className="flex-1 bg-white border border-gray-200 text-green-700 text-center font-semibold py-3 rounded-xl hover:bg-green-50 transition"
          >
            + Criar bolão
          </Link>
          <Link
            href="/bolao/entrar"
            className="flex-1 bg-white border border-gray-200 text-green-700 text-center font-semibold py-3 rounded-xl hover:bg-green-50 transition"
          >
            Entrar com código
          </Link>
        </div>

        {/* Meus bolões */}
        {participacoes.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Meus bolões</h2>
            <ul className="space-y-2">
              {participacoes.map(({ bolao }) => (
                <li key={bolao.id}>
                  <Link
                    href={`/bolao/${bolao.id}`}
                    className="flex items-center justify-between bg-white rounded-xl border p-4 hover:shadow-sm transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{bolao.nome}</p>
                      <p className="text-xs text-gray-400">
                        {bolao._count.participantes} participante{bolao._count.participantes !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-gray-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
