"use client";

import { useState } from "react";
import Image from "next/image";
import { getNomeTime, getFlagUrl } from "@/lib/times";

const MINUTOS_ANTES = 30;

type Jogo = {
  id: string;
  timeCasa: string;
  timeVisitante: string;
  dataHora: Date | string;
  fase: string;
  grupo: string | null;
  golsCasa: number | null;
  golsVisitante: number | null;
  encerrado: boolean;
};

type Palpite = {
  jogoId: string;
  golsCasaPalpite: number;
  golsVisitantePalpite: number;
  pontos: number | null;
} | null;

function badgePontos(pontos: number) {
  if (pontos === 10) return { bg: "bg-yellow-400", text: "text-yellow-900", label: "⭐ 10 pts — Placar exato!" };
  if (pontos === 6)  return { bg: "bg-green-500",  text: "text-white",      label: "✓ 6 pts — Vencedor + saldo" };
  if (pontos === 5)  return { bg: "bg-blue-500",   text: "text-white",      label: "✓ 5 pts — Vencedor certo" };
  return               { bg: "bg-gray-200",      text: "text-gray-600",   label: "✗ 0 pts — Não pontuou" };
}

export default function JogoCard({
  jogo,
  palpite,
  bolaoId,
}: {
  jogo: Jogo;
  palpite: Palpite;
  bolaoId: string;
}) {
  const [golsCasa, setGolsCasa] = useState(palpite?.golsCasaPalpite ?? "");
  const [golsVisitante, setGolsVisitante] = useState(palpite?.golsVisitantePalpite ?? "");
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState("");

  const dataHora = new Date(jogo.dataHora);
  const cutoff = new Date(dataHora.getTime() - MINUTOS_ANTES * 60 * 1000);
  const agora = new Date();

  const bloqueado = agora >= cutoff;   // >= 30 min antes: sem edição
  const encerrado = jogo.encerrado;    // admin lançou resultado

  const formatData = dataHora.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });

  const minutosRestantes = Math.ceil((cutoff.getTime() - agora.getTime()) / 60000);

  async function salvarPalpite() {
    setSalvando(true);
    setErro("");
    setSalvo(false);

    const res = await fetch("/api/palpite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jogoId: jogo.id,
        bolaoId,
        golsCasaPalpite: Number(golsCasa),
        golsVisitantePalpite: Number(golsVisitante),
      }),
    });

    setSalvando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Erro ao salvar.");
    } else {
      setSalvo(true);
    }
  }

  const badge = encerrado && palpite?.pontos !== null && palpite?.pontos !== undefined
    ? badgePontos(palpite.pontos)
    : null;

  return (
    <div className={`bg-white rounded-xl border p-4 ${bloqueado && !encerrado ? "opacity-75" : ""}`}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>{formatData}</span>
        {!bloqueado && minutosRestantes <= 60 && (
          <span className="text-orange-500 font-medium">⏱ {minutosRestantes} min para fechar</span>
        )}
        {bloqueado && !encerrado && (
          <span className="text-gray-400 italic">Palpites encerrados</span>
        )}
      </div>

      {/* Times e placar/inputs */}
      <div className="flex items-center gap-3">
        <span className="flex-1 flex items-center justify-end gap-2 font-semibold text-gray-800">
          {getNomeTime(jogo.timeCasa)}
          <Image src={getFlagUrl(jogo.timeCasa)} alt={jogo.timeCasa} width={28} height={20} className="rounded-sm object-cover border border-gray-200" unoptimized />
        </span>

        {encerrado ? (
          <div className="text-center min-w-[80px]">
            <span className="text-2xl font-bold text-gray-800">
              {jogo.golsCasa} <span className="text-gray-400">×</span> {jogo.golsVisitante}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number" min={0} max={99}
              disabled={bloqueado}
              value={golsCasa}
              onChange={(e) => { setGolsCasa(e.target.value); setSalvo(false); }}
              className="w-12 text-center border rounded-lg py-1 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
            <span className="text-gray-400 font-bold">×</span>
            <input
              type="number" min={0} max={99}
              disabled={bloqueado}
              value={golsVisitante}
              onChange={(e) => { setGolsVisitante(e.target.value); setSalvo(false); }}
              className="w-12 text-center border rounded-lg py-1 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>
        )}

        <span className="flex-1 flex items-center gap-2 font-semibold text-gray-800">
          <Image src={getFlagUrl(jogo.timeVisitante)} alt={jogo.timeVisitante} width={28} height={20} className="rounded-sm object-cover border border-gray-200" unoptimized />
          {getNomeTime(jogo.timeVisitante)}
        </span>
      </div>

      {/* Resultado + pontos (após encerramento) */}
      {encerrado && palpite && badge && (
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Seu palpite: <span className="font-semibold text-gray-700">
              {palpite.golsCasaPalpite} × {palpite.golsVisitantePalpite}
            </span>
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        </div>
      )}

      {encerrado && !palpite && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-400 text-center italic">
          Você não palpitou neste jogo
        </div>
      )}

      {/* Botão salvar */}
      {!bloqueado && (
        <div className="mt-3 flex items-center justify-end gap-2">
          {erro && <span className="text-xs text-red-500">{erro}</span>}
          {salvo && <span className="text-xs text-green-600">Palpite salvo!</span>}
          <button
            onClick={salvarPalpite}
            disabled={salvando || golsCasa === "" || golsVisitante === ""}
            className="text-sm bg-green-700 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {salvando ? "Salvando..." : palpite ? "Atualizar" : "Palpitar"}
          </button>
        </div>
      )}
    </div>
  );
}
