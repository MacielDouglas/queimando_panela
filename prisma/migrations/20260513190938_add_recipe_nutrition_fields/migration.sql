-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "nutritionPer100g" JSONB,
ADD COLUMN     "nutritionSummary" TEXT;
