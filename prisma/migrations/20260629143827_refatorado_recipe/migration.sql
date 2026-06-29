/*
  Warnings:

  - Added the required column `updatedAt` to the `GeneralIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RecipeType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Utensil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneralIngredient" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "consumptionSummary" TEXT,
ADD COLUMN     "originSummary" TEXT;

-- AlterTable
ALTER TABLE "RecipeType" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Utensil" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "sectionId" UUID,
    "order" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecipeStep_recipeId_idx" ON "RecipeStep"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeStep_sectionId_idx" ON "RecipeStep"("sectionId");

-- CreateIndex
CREATE INDEX "RecipeStep_recipeId_order_idx" ON "RecipeStep"("recipeId", "order");

-- CreateIndex
CREATE INDEX "RecipeStep_sectionId_order_idx" ON "RecipeStep"("sectionId", "order");

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RecipeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
