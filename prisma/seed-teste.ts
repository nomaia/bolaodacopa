import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const SENHA_HASH = bcrypt.hashSync("teste123", 10);

const USUARIOS_FICTICIOS = [
  { name: "Ana Lima",      email: "ana@teste.com" },
  { name: "Carlos Souza", email: "carlos@teste.com" },
  { name: "Beatriz Melo", email: "bea@teste.com" },
  { name: "Diego Ramos",  email: "diego@teste.com" },
];

// Palpites para os 4 primeiros jogos da Rodada 1
// [golsCasa, golsVisitante]
const PALPITES: Record<string, [number, number][]> = {
  // jogo index → [ana, carlos, bea, diego, nomaia]
  "Mexico vs South Africa":     [[2,0],[1,1],[2,1],[0,1],[3,0]],
  "South Korea vs Czechia":     [[1,1],[0,1],[2,0],[1,2],[1,0]],
  "Canada vs Bosnia-Herzegovina":[[1,0],[2,1],[1,1],[0,0],[2,0]],
  "Qatar vs Switzerland":       [[0,2],[1,3],[0,1],[2,1],[0,3]],
};

async function main() {
  console.log("🔍 Buscando usuário admin (nomaia@gmail.com)...");
  const nomaia = await prisma.user.findUnique({ where: { email: "nomaia@gmail.com" } });
  if (!nomaia) {
    console.error("❌ Usuário nomaia@gmail.com não encontrado. Cadastre-se primeiro.");
    process.exit(1);
  }

  // Criar (ou reusar) usuários fictícios
  console.log("👥 Criando usuários fictícios...");
  const fictícios = await Promise.all(
    USUARIOS_FICTICIOS.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash: SENHA_HASH },
      })
    )
  );
  const todosUsuarios = [nomaia, ...fictícios];

  // Criar bolão de teste
  console.log("🏆 Criando bolão de teste...");
  const bolao = await prisma.bolao.upsert({
    where: { codigo: "TESTE2026" },
    update: {},
    create: {
      nome: "Bolão de Teste",
      descricao: "Bolão para testar resultados e ranking",
      codigo: "TESTE2026",
      publico: false,
      criadorId: nomaia.id,
    },
  });

  // Adicionar todos como participantes
  console.log("📋 Adicionando participantes...");
  for (const u of todosUsuarios) {
    await prisma.participante.upsert({
      where: { userId_bolaoId: { userId: u.id, bolaoId: bolao.id } },
      update: {},
      create: { userId: u.id, bolaoId: bolao.id },
    });
  }

  // Buscar os 4 jogos
  const jogosAlvo = [
    { timeCasa: "Mexico",  timeVisitante: "South Africa" },
    { timeCasa: "South Korea", timeVisitante: "Czechia" },
    { timeCasa: "Canada", timeVisitante: "Bosnia-Herzegovina" },
    { timeCasa: "Qatar",  timeVisitante: "Switzerland" },
  ];

  console.log("⚽ Inserindo palpites...");
  for (const { timeCasa, timeVisitante } of jogosAlvo) {
    const chave = `${timeCasa} vs ${timeVisitante}`;
    const palpitesDoJogo = PALPITES[chave];
    if (!palpitesDoJogo) { console.warn(`  ⚠ Sem palpites definidos para ${chave}`); continue; }

    const jogo = await prisma.jogo.findFirst({ where: { timeCasa, timeVisitante } });
    if (!jogo) { console.warn(`  ⚠ Jogo não encontrado: ${chave}`); continue; }

    for (let i = 0; i < todosUsuarios.length; i++) {
      const user = todosUsuarios[i];
      const [golsCasaPalpite, golsVisitantePalpite] = palpitesDoJogo[i];
      await prisma.palpite.upsert({
        where: { userId_jogoId_bolaoId: { userId: user.id, jogoId: jogo.id, bolaoId: bolao.id } },
        update: { golsCasaPalpite, golsVisitantePalpite },
        create: { userId: user.id, jogoId: jogo.id, bolaoId: bolao.id, golsCasaPalpite, golsVisitantePalpite },
      });
      console.log(`  ✓ ${user.name}: ${timeCasa} ${golsCasaPalpite}×${golsVisitantePalpite} ${timeVisitante}`);
    }
  }

  console.log("\n✅ Seed de teste concluído!");
  console.log(`   Bolão: "${bolao.nome}" (código: ${bolao.codigo})`);
  console.log(`   Participantes: ${todosUsuarios.map(u => u.name).join(", ")}`);
  console.log(`   Palpites em ${jogosAlvo.length} jogos para ${todosUsuarios.length} usuários`);
  console.log("\n   Agora lance os resultados no painel admin e veja o ranking!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
