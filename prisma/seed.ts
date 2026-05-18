import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// Todos os tempos em UTC (ET = UTC-4 no verão)
const JOGOS = [
  // ── RODADA 1 ───────────────────────────────────────────────────────────────
  { timeCasa: "Mexico",      timeVisitante: "South Africa",        dataHora: "2026-06-11T19:00:00Z", grupo: "A", rodada: 1 },
  { timeCasa: "South Korea", timeVisitante: "Czechia",             dataHora: "2026-06-12T02:00:00Z", grupo: "A", rodada: 1 },
  { timeCasa: "Canada",      timeVisitante: "Bosnia-Herzegovina",  dataHora: "2026-06-12T19:00:00Z", grupo: "B", rodada: 1 },
  { timeCasa: "USA",         timeVisitante: "Paraguay",            dataHora: "2026-06-13T01:00:00Z", grupo: "D", rodada: 1 },
  { timeCasa: "Qatar",       timeVisitante: "Switzerland",         dataHora: "2026-06-13T19:00:00Z", grupo: "B", rodada: 1 },
  { timeCasa: "Brazil",      timeVisitante: "Morocco",             dataHora: "2026-06-13T22:00:00Z", grupo: "C", rodada: 1 },
  { timeCasa: "Haiti",       timeVisitante: "Scotland",            dataHora: "2026-06-14T01:00:00Z", grupo: "C", rodada: 1 },
  { timeCasa: "Australia",   timeVisitante: "Turkey",              dataHora: "2026-06-14T04:00:00Z", grupo: "D", rodada: 1 },
  { timeCasa: "Germany",     timeVisitante: "Curaçao",             dataHora: "2026-06-14T17:00:00Z", grupo: "E", rodada: 1 },
  { timeCasa: "Netherlands", timeVisitante: "Japan",               dataHora: "2026-06-14T20:00:00Z", grupo: "F", rodada: 1 },
  { timeCasa: "Ivory Coast", timeVisitante: "Ecuador",             dataHora: "2026-06-14T23:00:00Z", grupo: "E", rodada: 1 },
  { timeCasa: "Tunisia",     timeVisitante: "Sweden",              dataHora: "2026-06-15T02:00:00Z", grupo: "F", rodada: 1 },
  { timeCasa: "Spain",       timeVisitante: "Cape Verde",          dataHora: "2026-06-15T16:00:00Z", grupo: "H", rodada: 1 },
  { timeCasa: "Belgium",     timeVisitante: "Egypt",               dataHora: "2026-06-15T19:00:00Z", grupo: "G", rodada: 1 },
  { timeCasa: "Saudi Arabia",timeVisitante: "Uruguay",             dataHora: "2026-06-15T22:00:00Z", grupo: "H", rodada: 1 },
  { timeCasa: "Iran",        timeVisitante: "New Zealand",         dataHora: "2026-06-16T01:00:00Z", grupo: "G", rodada: 1 },
  { timeCasa: "France",      timeVisitante: "Senegal",             dataHora: "2026-06-16T19:00:00Z", grupo: "I", rodada: 1 },
  { timeCasa: "Iraq",        timeVisitante: "Norway",              dataHora: "2026-06-16T22:00:00Z", grupo: "I", rodada: 1 },
  { timeCasa: "Argentina",   timeVisitante: "Algeria",             dataHora: "2026-06-17T01:00:00Z", grupo: "J", rodada: 1 },
  { timeCasa: "Austria",     timeVisitante: "Jordan",              dataHora: "2026-06-17T04:00:00Z", grupo: "J", rodada: 1 },
  { timeCasa: "Portugal",    timeVisitante: "Congo DR",            dataHora: "2026-06-17T17:00:00Z", grupo: "K", rodada: 1 },
  { timeCasa: "England",     timeVisitante: "Croatia",             dataHora: "2026-06-17T20:00:00Z", grupo: "L", rodada: 1 },
  { timeCasa: "Ghana",       timeVisitante: "Panama",              dataHora: "2026-06-17T23:00:00Z", grupo: "L", rodada: 1 },
  { timeCasa: "Uzbekistan",  timeVisitante: "Colombia",            dataHora: "2026-06-18T02:00:00Z", grupo: "K", rodada: 1 },

  // ── RODADA 2 ───────────────────────────────────────────────────────────────
  { timeCasa: "Czechia",              timeVisitante: "South Africa",       dataHora: "2026-06-18T16:00:00Z", grupo: "A", rodada: 2 },
  { timeCasa: "Switzerland",          timeVisitante: "Bosnia-Herzegovina", dataHora: "2026-06-18T19:00:00Z", grupo: "B", rodada: 2 },
  { timeCasa: "Canada",               timeVisitante: "Qatar",              dataHora: "2026-06-18T22:00:00Z", grupo: "B", rodada: 2 },
  { timeCasa: "Mexico",               timeVisitante: "South Korea",        dataHora: "2026-06-19T01:00:00Z", grupo: "A", rodada: 2 },
  { timeCasa: "USA",                  timeVisitante: "Australia",          dataHora: "2026-06-19T19:00:00Z", grupo: "D", rodada: 2 },
  { timeCasa: "Scotland",             timeVisitante: "Morocco",            dataHora: "2026-06-19T19:00:00Z", grupo: "C", rodada: 2 },
  { timeCasa: "Brazil",               timeVisitante: "Haiti",              dataHora: "2026-06-20T01:00:00Z", grupo: "C", rodada: 2 },
  { timeCasa: "Turkey",               timeVisitante: "Paraguay",           dataHora: "2026-06-20T04:00:00Z", grupo: "D", rodada: 2 },
  { timeCasa: "Netherlands",          timeVisitante: "Sweden",             dataHora: "2026-06-20T17:00:00Z", grupo: "F", rodada: 2 },
  { timeCasa: "Germany",              timeVisitante: "Ivory Coast",        dataHora: "2026-06-20T20:00:00Z", grupo: "E", rodada: 2 },
  { timeCasa: "Ecuador",              timeVisitante: "Curaçao",            dataHora: "2026-06-21T00:00:00Z", grupo: "E", rodada: 2 },
  { timeCasa: "Tunisia",              timeVisitante: "Japan",              dataHora: "2026-06-21T04:00:00Z", grupo: "F", rodada: 2 },
  { timeCasa: "Spain",                timeVisitante: "Saudi Arabia",       dataHora: "2026-06-21T16:00:00Z", grupo: "H", rodada: 2 },
  { timeCasa: "Belgium",              timeVisitante: "Iran",               dataHora: "2026-06-21T19:00:00Z", grupo: "G", rodada: 2 },
  { timeCasa: "Uruguay",              timeVisitante: "Cape Verde",         dataHora: "2026-06-21T22:00:00Z", grupo: "H", rodada: 2 },
  { timeCasa: "New Zealand",          timeVisitante: "Egypt",              dataHora: "2026-06-22T01:00:00Z", grupo: "G", rodada: 2 },
  { timeCasa: "Argentina",            timeVisitante: "Austria",            dataHora: "2026-06-22T17:00:00Z", grupo: "J", rodada: 2 },
  { timeCasa: "France",               timeVisitante: "Iraq",               dataHora: "2026-06-22T21:00:00Z", grupo: "I", rodada: 2 },
  { timeCasa: "Norway",               timeVisitante: "Senegal",            dataHora: "2026-06-23T00:00:00Z", grupo: "I", rodada: 2 },
  { timeCasa: "Jordan",               timeVisitante: "Algeria",            dataHora: "2026-06-23T03:00:00Z", grupo: "J", rodada: 2 },
  { timeCasa: "Portugal",             timeVisitante: "Uzbekistan",         dataHora: "2026-06-23T17:00:00Z", grupo: "K", rodada: 2 },
  { timeCasa: "England",              timeVisitante: "Ghana",              dataHora: "2026-06-23T20:00:00Z", grupo: "L", rodada: 2 },
  { timeCasa: "Panama",               timeVisitante: "Croatia",            dataHora: "2026-06-23T23:00:00Z", grupo: "L", rodada: 2 },
  { timeCasa: "Colombia",             timeVisitante: "Congo DR",           dataHora: "2026-06-24T02:00:00Z", grupo: "K", rodada: 2 },

  // ── RODADA 3 ───────────────────────────────────────────────────────────────
  { timeCasa: "Switzerland",          timeVisitante: "Canada",             dataHora: "2026-06-24T19:00:00Z", grupo: "B", rodada: 3 },
  { timeCasa: "Bosnia-Herzegovina",   timeVisitante: "Qatar",              dataHora: "2026-06-24T19:00:00Z", grupo: "B", rodada: 3 },
  { timeCasa: "Brazil",               timeVisitante: "Scotland",           dataHora: "2026-06-24T22:00:00Z", grupo: "C", rodada: 3 },
  { timeCasa: "Morocco",              timeVisitante: "Haiti",              dataHora: "2026-06-24T22:00:00Z", grupo: "C", rodada: 3 },
  { timeCasa: "Mexico",               timeVisitante: "Czechia",            dataHora: "2026-06-25T01:00:00Z", grupo: "A", rodada: 3 },
  { timeCasa: "South Korea",          timeVisitante: "South Africa",       dataHora: "2026-06-25T01:00:00Z", grupo: "A", rodada: 3 },
  { timeCasa: "Ecuador",              timeVisitante: "Germany",            dataHora: "2026-06-25T20:00:00Z", grupo: "E", rodada: 3 },
  { timeCasa: "Curaçao",              timeVisitante: "Ivory Coast",        dataHora: "2026-06-25T20:00:00Z", grupo: "E", rodada: 3 },
  { timeCasa: "Tunisia",              timeVisitante: "Netherlands",        dataHora: "2026-06-25T23:00:00Z", grupo: "F", rodada: 3 },
  { timeCasa: "Japan",                timeVisitante: "Sweden",             dataHora: "2026-06-25T23:00:00Z", grupo: "F", rodada: 3 },
  { timeCasa: "USA",                  timeVisitante: "Turkey",             dataHora: "2026-06-26T02:00:00Z", grupo: "D", rodada: 3 },
  { timeCasa: "Paraguay",             timeVisitante: "Australia",          dataHora: "2026-06-26T02:00:00Z", grupo: "D", rodada: 3 },
  { timeCasa: "Norway",               timeVisitante: "France",             dataHora: "2026-06-26T19:00:00Z", grupo: "I", rodada: 3 },
  { timeCasa: "Senegal",              timeVisitante: "Iraq",               dataHora: "2026-06-26T19:00:00Z", grupo: "I", rodada: 3 },
  { timeCasa: "Uruguay",              timeVisitante: "Spain",              dataHora: "2026-06-27T00:00:00Z", grupo: "H", rodada: 3 },
  { timeCasa: "Cape Verde",           timeVisitante: "Saudi Arabia",       dataHora: "2026-06-27T00:00:00Z", grupo: "H", rodada: 3 },
  { timeCasa: "New Zealand",          timeVisitante: "Belgium",            dataHora: "2026-06-27T03:00:00Z", grupo: "G", rodada: 3 },
  { timeCasa: "Egypt",                timeVisitante: "Iran",               dataHora: "2026-06-27T03:00:00Z", grupo: "G", rodada: 3 },
  { timeCasa: "Panama",               timeVisitante: "England",            dataHora: "2026-06-27T21:00:00Z", grupo: "L", rodada: 3 },
  { timeCasa: "Croatia",              timeVisitante: "Ghana",              dataHora: "2026-06-27T21:00:00Z", grupo: "L", rodada: 3 },
  { timeCasa: "Colombia",             timeVisitante: "Portugal",           dataHora: "2026-06-27T23:30:00Z", grupo: "K", rodada: 3 },
  { timeCasa: "Congo DR",             timeVisitante: "Uzbekistan",         dataHora: "2026-06-27T23:30:00Z", grupo: "K", rodada: 3 },
  { timeCasa: "Argentina",            timeVisitante: "Jordan",             dataHora: "2026-06-28T02:00:00Z", grupo: "J", rodada: 3 },
  { timeCasa: "Algeria",              timeVisitante: "Austria",            dataHora: "2026-06-28T02:00:00Z", grupo: "J", rodada: 3 },
];

function makeId(timeCasa: string, timeVisitante: string) {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `copa26-${normalize(timeCasa)}-vs-${normalize(timeVisitante)}`;
}

async function main() {
  console.log("Limpando jogos antigos do seed da TheSportsDB...");
  await prisma.jogo.deleteMany({ where: { id: { startsWith: "sdb-" } } });

  console.log(`Inserindo ${JOGOS.length} jogos da fase de grupos...`);
  let inseridos = 0;
  let atualizados = 0;

  for (const jogo of JOGOS) {
    const id = makeId(jogo.timeCasa, jogo.timeVisitante);
    const existing = await prisma.jogo.findFirst({ where: { id } });

    if (existing) {
      await prisma.jogo.update({ where: { id }, data: { ...jogo, dataHora: new Date(jogo.dataHora), fase: "Fase de Grupos" } });
      atualizados++;
    } else {
      await prisma.jogo.create({ data: { id, ...jogo, dataHora: new Date(jogo.dataHora), fase: "Fase de Grupos" } });
      inseridos++;
    }
  }

  console.log(`✓ ${inseridos} inseridos, ${atualizados} atualizados.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
