import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  const duasHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const jogos = await prisma.jogo.updateMany({
    where: { timeCasa: { in: ["Mexico", "South Korea", "Canada", "Qatar"] }, rodada: 1 },
    data: {
      encerrado: false,
      golsCasa: null,
      golsVisitante: null,
      dataHora: duasHorasAtras,
    },
  });
  console.log(`✅ ${jogos.count} jogos resetados (encerrado=false, gols=null)`);

  const palpites = await prisma.palpite.updateMany({
    where: {
      jogo: { timeCasa: { in: ["Mexico", "South Korea", "Canada", "Qatar"] }, rodada: 1 },
    },
    data: { pontos: null },
  });
  console.log(`✅ ${palpites.count} palpites resetados (pontos=null)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
