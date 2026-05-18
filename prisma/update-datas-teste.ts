import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  const duasHorasAtras = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const r = await prisma.jogo.updateMany({
    where: { timeCasa: { in: ["Mexico", "South Korea", "Canada", "Qatar"] }, rodada: 1 },
    data: { dataHora: duasHorasAtras },
  });
  console.log(`✅ ${r.count} jogos atualizados para 2h atrás`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
