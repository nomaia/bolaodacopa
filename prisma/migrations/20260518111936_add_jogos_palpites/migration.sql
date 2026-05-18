-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Jogo" (
    "id" TEXT NOT NULL,
    "timeCasa" TEXT NOT NULL,
    "timeVisitante" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "fase" TEXT NOT NULL,
    "grupo" TEXT,
    "golsCasa" INTEGER,
    "golsVisitante" INTEGER,
    "encerrado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palpite" (
    "id" TEXT NOT NULL,
    "golsCasaPalpite" INTEGER NOT NULL,
    "golsVisitantePalpite" INTEGER NOT NULL,
    "pontos" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "jogoId" TEXT NOT NULL,

    CONSTRAINT "Palpite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Palpite_userId_jogoId_key" ON "Palpite"("userId", "jogoId");

-- AddForeignKey
ALTER TABLE "Palpite" ADD CONSTRAINT "Palpite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palpite" ADD CONSTRAINT "Palpite_jogoId_fkey" FOREIGN KEY ("jogoId") REFERENCES "Jogo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
