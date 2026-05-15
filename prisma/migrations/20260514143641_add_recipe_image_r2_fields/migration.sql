/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `RecipeImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `RecipeImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeImage" ADD COLUMN     "contentType" TEXT,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "sizeBytes" INTEGER,
ADD COLUMN     "width" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "RecipeImage_key_key" ON "RecipeImage"("key");
