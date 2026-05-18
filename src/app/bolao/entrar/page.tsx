"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EntrarBolaoPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/bolao/entrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: codigo.trim().toUpperCase() }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Bolão não encontrado.");
      return;
    }

    const data = await res.json();
    router.push(`/bolao/${data.bolaoId}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-start justify-center p-6 pt-16">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-xl font-bold text-green-800">Entrar em um bolão</h1>
        </div>

        <p className="text-sm text-gray-500">
          Digite o código do bolão que você recebeu do organizador.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código do bolão</label>
            <input
              type="text"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              maxLength={8}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Entrar no bolão"}
          </button>
        </form>
      </div>
    </main>
  );
}
