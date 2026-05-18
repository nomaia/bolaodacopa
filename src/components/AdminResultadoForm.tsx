"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminResultadoForm({ jogoId }: { jogoId: string }) {
  const router = useRouter();
  const [golsCasa, setGolsCasa] = useState("");
  const [golsVisitante, setGolsVisitante] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMsg(null);

    const res = await fetch(`/api/admin/jogo/${jogoId}/resultado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ golsCasa: Number(golsCasa), golsVisitante: Number(golsVisitante) }),
    });

    setSalvando(false);

    if (res.ok) {
      const data = await res.json();
      setMsg({ tipo: "ok", texto: `✓ Resultado salvo — ${data.palpitesAtualizados} palpite(s) pontuado(s)` });
      router.refresh();
    } else {
      const data = await res.json();
      setMsg({ tipo: "erro", texto: data.error ?? "Erro ao salvar." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-medium text-yellow-700">Lançar resultado:</span>

      <div className="flex items-center gap-2">
        <input
          type="number" min={0} max={99} required
          value={golsCasa}
          onChange={(e) => setGolsCasa(e.target.value)}
          placeholder="0"
          className="w-14 border rounded-lg px-2 py-1.5 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <span className="text-gray-400 font-bold text-lg">×</span>
        <input
          type="number" min={0} max={99} required
          value={golsVisitante}
          onChange={(e) => setGolsVisitante(e.target.value)}
          placeholder="0"
          className="w-14 border rounded-lg px-2 py-1.5 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        type="submit"
        disabled={salvando || golsCasa === "" || golsVisitante === ""}
        className="bg-green-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
      >
        {salvando ? "Salvando..." : "Confirmar resultado"}
      </button>

      {msg && (
        <span className={`text-xs font-medium ${msg.tipo === "ok" ? "text-green-700" : "text-red-600"}`}>
          {msg.texto}
        </span>
      )}
    </form>
  );
}
