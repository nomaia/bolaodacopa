"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FASES = ["Fase de Grupos", "Oitavas de Final", "Quartas de Final", "Semifinal", "Final"];

export default function AdminJogoForm() {
  const router = useRouter();
  const [timeCasa, setTimeCasa] = useState("");
  const [timeVisitante, setTimeVisitante] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [fase, setFase] = useState("Fase de Grupos");
  const [grupo, setGrupo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMsg("");

    const res = await fetch("/api/admin/jogo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeCasa, timeVisitante, dataHora, fase, grupo: grupo || null }),
    });

    setSalvando(false);
    if (res.ok) {
      setTimeCasa(""); setTimeVisitante(""); setDataHora(""); setGrupo("");
      setMsg("Jogo criado!");
      router.refresh();
    } else {
      const data = await res.json();
      setMsg(data.error ?? "Erro ao criar jogo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Time da casa</label>
        <input required value={timeCasa} onChange={(e) => setTimeCasa(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Time visitante</label>
        <input required value={timeVisitante} onChange={(e) => setTimeVisitante(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Data e hora</label>
        <input type="datetime-local" required value={dataHora} onChange={(e) => setDataHora(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Fase</label>
        <select value={fase} onChange={(e) => setFase(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
          {FASES.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Grupo (opcional)</label>
        <input placeholder="A, B, C..." value={grupo} onChange={(e) => setGrupo(e.target.value.toUpperCase())} maxLength={1}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div className="flex items-end gap-2">
        <button type="submit" disabled={salvando}
          className="flex-1 bg-green-700 text-white text-sm font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60">
          {salvando ? "Salvando..." : "Criar jogo"}
        </button>
      </div>
      {msg && <p className="col-span-2 text-sm text-green-700">{msg}</p>}
    </form>
  );
}
