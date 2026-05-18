"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const passos = [
  { num: "1", label: "Entre com Google ou crie uma conta", cor: "bg-yellow-400 text-yellow-900" },
  { num: "2", label: "Acesse um bolão com o código", cor: "bg-green-400 text-green-900" },
  { num: "3", label: "Dê seus palpites antes do jogo", cor: "bg-blue-400 text-blue-900" },
  { num: "4", label: "Torça e acompanhe o ranking", cor: "bg-orange-400 text-orange-900" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-700 p-6 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-5">
        <div className="text-center">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Bolão da Copa</h1>
          <p className="text-gray-400 text-sm mt-1">Copa do Mundo 2026</p>
        </div>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition font-medium text-gray-700 text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.5 26.9 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Entrar com Google
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email/senha */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60 text-sm"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-green-700 font-medium hover:underline">
            Cadastre-se
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
