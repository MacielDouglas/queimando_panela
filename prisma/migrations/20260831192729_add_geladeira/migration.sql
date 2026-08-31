-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "isAiGenerated" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "geladeira_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geladeira_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "geladeira_log_userId_createdAt_idx" ON "geladeira_log"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Recipe_isAiGenerated_idx" ON "Recipe"("isAiGenerated");

-- AddForeignKey
ALTER TABLE "geladeira_log" ADD CONSTRAINT "geladeira_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
