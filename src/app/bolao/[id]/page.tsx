import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BolaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bolao = await prisma.bolao.findUnique({
    where: { id },
    include: {
      criador: { select: { name: true } },
      participantes: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!bolao) notFound();

  const participa = bolao.participantes.some((p) => p.userId === session.user.id);
  if (!participa) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="hover:opacity-75">←</Link>
        <div>
          <h1 className="font-bold text-lg">{bolao.nome}</h1>
          <p className="text-green-200 text-sm">Criado por {bolao.criador.name}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Código do bolão</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-green-700">
              {bolao.codigo}
            </p>
          </div>
          <p className="text-sm text-gray-400">Compartilhe com seus amigos</p>
        </div>

        {bolao.descricao && (
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500 mb-1">Descrição</p>
            <p className="text-gray-700">{bolao.descricao}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href={`/bolao/${id}/jogos`}
            className="flex-1 flex items-center justify-between bg-green-700 text-white rounded-xl px-5 py-3 hover:bg-green-600 transition"
          >
            <span className="font-semibold">⚽ Dar palpites</span>
            <span>→</span>
          </Link>
          <Link
            href={`/bolao/${id}/ranking`}
            className="flex-1 flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-5 py-3 hover:bg-green-100 transition"
          >
            <span className="font-semibold text-green-800">🏆 Ranking</span>
            <span className="text-green-600">→</span>
          </Link>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Participantes ({bolao.participantes.length})
          </h2>
          <ul className="space-y-2">
            {bolao.participantes.map(({ user }) => (
              <li key={user.id} className="bg-white rounded-xl border px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="text-gray-800">{user.name}</span>
                {user.id === bolao.criadorId && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Criador
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
