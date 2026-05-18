"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoBolaoPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [publico, setPublico] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/bolao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, publico }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao criar bolão.");
      return;
    }

    const data = await res.json();
    router.push(`/bolao/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center p-6 pt-16">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-xl font-bold text-green-800">Criar novo bolão</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do bolão</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Copa dos Amigos 2026"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (opcional)</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="publico"
              checked={publico}
              onChange={(e) => setPublico(e.target.checked)}
              className="w-4 h-4 accent-green-700"
            />
            <label htmlFor="publico" className="text-sm text-gray-700">
              Visível para todos (qualquer pessoa pode entrar com o código)
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar bolão"}
          </button>
        </form>
      </div>
    </main>
  );
}
