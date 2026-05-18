"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-700 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-green-800 mt-2">Entrar</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-green-700 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
