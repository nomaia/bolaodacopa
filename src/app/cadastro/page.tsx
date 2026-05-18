"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard");
  }

  const passos = [
    { num: "1", label: "Crie sua conta ou entre", cor: "bg-yellow-400 text-yellow-900" },
    { num: "2", label: "Acesse um bolão com o código", cor: "bg-green-400 text-green-900" },
    { num: "3", label: "Dê seus palpites antes do jogo", cor: "bg-blue-400 text-blue-900" },
    { num: "4", label: "Torça e acompanhe o ranking", cor: "bg-orange-400 text-orange-900" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-700 p-6 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Criar conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Já tem conta?{" "}
          <Link href="/login" className="text-green-700 font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>

      {/* Passo a passo */}
      <div className="w-full max-w-sm bg-white/10 rounded-xl p-5 space-y-3">
        <p className="text-white text-xs font-semibold uppercase tracking-widest text-center mb-1">Como funciona</p>
        {passos.map((p) => (
          <div key={p.num} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${p.cor}`}>
              {p.num}
            </div>
            <p className="text-white text-sm">{p.label}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
