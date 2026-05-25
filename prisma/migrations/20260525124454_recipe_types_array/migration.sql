/*
  Warnings:

  - You are about to drop the column `type` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Recipe_type_idx";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "type",
ADD COLUMN     "types" TEXT[];

-- CreateIndex
CREATE INDEX "Recipe_types_idx" ON "Recipe"("types");
