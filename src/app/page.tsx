import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const PASSOS = [
  {
    num: "1",
    titulo: "Crie sua conta",
    desc: "Cadastro rápido com nome, e-mail e senha. Sem complicação.",
    cor: "bg-yellow-400 text-yellow-900",
  },
  {
    num: "2",
    titulo: "Entre em um bolão",
    desc: "Use o código compartilhado pelo organizador ou crie o seu próprio.",
    cor: "bg-green-400 text-green-900",
  },
  {
    num: "3",
    titulo: "Dê seus palpites",
    desc: "Palpite no placar de cada jogo até 30 minutos antes de começar.",
    cor: "bg-blue-400 text-blue-900",
  },
  {
    num: "4",
    titulo: "Torça e acompanhe",
    desc: "Veja o ranking, compare palpites e dispute ponto a ponto com os amigos.",
    cor: "bg-orange-400 text-orange-900",
  },
];

export default async function Home() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-green-700 text-white flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-10">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-4xl font-bold tracking-tight">Bolão da Copa</h1>
        <p className="mt-3 text-green-200 text-lg max-w-sm">
          Copa do Mundo 2026 — palpite, pontue e dispute com os amigos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-xs">
          <Link
            href="/cadastro"
            className="flex-1 bg-yellow-400 text-green-900 font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition text-center"
          >
            Criar conta
          </Link>
          <Link
            href="/login"
            className="flex-1 border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-green-700 transition text-center"
          >
            Entrar
          </Link>
        </div>
      </div>

      {/* Divisor */}
      <div className="text-center text-green-300 text-sm font-medium tracking-widest uppercase pb-6">
        Como funciona
      </div>

      {/* Passos */}
      <div className="bg-white text-gray-800 flex-1 rounded-t-3xl px-6 py-10">
        <div className="max-w-lg mx-auto space-y-6">
          {PASSOS.map((p) => (
            <div key={p.num} className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${p.cor}`}>
                {p.num}
              </div>
              <div>
                <p className="font-bold text-gray-900">{p.titulo}</p>
                <p className="text-gray-500 text-sm mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <p className="text-center text-gray-400 text-xs mt-10">
          Copa do Mundo 2026 · Canadá, México e Estados Unidos
        </p>
      </div>
    </main>
  );
}
