type Resultado = { golsCasa: number; golsVisitante: number };

function vencedor(r: Resultado): "casa" | "visitante" | "empate" {
  if (r.golsCasa > r.golsVisitante) return "casa";
  if (r.golsCasa < r.golsVisitante) return "visitante";
  return "empate";
}

function saldo(r: Resultado): number {
  return Math.abs(r.golsCasa - r.golsVisitante);
}

export function calcularPontos(
  real: Resultado,
  palpite: Resultado
): number {
  const acertouPlacar =
    real.golsCasa === palpite.golsCasa &&
    real.golsVisitante === palpite.golsVisitante;

  if (acertouPlacar) return 10;

  const acertouVencedor = vencedor(real) === vencedor(palpite);
  if (!acertouVencedor) return 0;

  const acertouSaldo = saldo(real) === saldo(palpite);
  return acertouSaldo ? 6 : 5;
}
