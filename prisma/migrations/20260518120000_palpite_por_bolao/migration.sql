-- AlterTable: add bolaoId to Palpite
ALTER TABLE "Palpite" ADD COLUMN "bolaoId" TEXT NOT NULL DEFAULT '';

-- Update existing rows to use a valid bolaoId (cleanup only - no real palpites yet)
-- The DEFAULT '' is temporary; we drop it after

-- AddForeignKey
ALTER TABLE "Palpite" ADD CONSTRAINT "Palpite_bolaoId_fkey" FOREIGN KEY ("bolaoId") REFERENCES "Bolao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "Palpite_userId_jogoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Palpite_userId_jogoId_bolaoId_key" ON "Palpite"("userId", "jogoId", "bolaoId");

-- AlterColumn: remove default
ALTER TABLE "Palpite" ALTER COLUMN "bolaoId" DROP DEFAULT;
