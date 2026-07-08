-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('MUITO_FACIL', 'FACIL', 'MEDIA', 'AVANCADA', 'PROFISSIONAL');

-- CreateEnum
CREATE TYPE "RecipeCategory" AS ENUM ('APERITIVO', 'ENTRADA', 'PRATO_PRINCIPAL', 'ACOMPANHAMENTO', 'LANCHE', 'SOBREMESA', 'BEBIDA', 'CAFE_DA_MANHA', 'MOLHO', 'CALDO', 'SOPA', 'SALADA', 'MASSA', 'BOLO', 'TORTA', 'DOCE', 'OUTRO');

-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('BRASILEIRA', 'FRANCESA', 'ITALO_AMERICANA', 'AMERICANA', 'ITALIANA', 'PORTUGUESA', 'MEXICANA', 'ARABE', 'JAPONESA', 'CHINESA', 'INDIANA', 'MEDITERRANEA', 'NORDESTINA', 'MINEIRA', 'BAIANA', 'VEGANA', 'VEGETARIANA', 'OUTRA');

-- CreateEnum
CREATE TYPE "FlavorType" AS ENUM ('SALGADO', 'DOCE', 'AZEDO', 'AMARGO', 'UMAMI', 'PICANTE', 'AGRIDOCE');

-- CreateEnum
CREATE TYPE "StyleType" AS ENUM ('TRADICIONAL', 'CLASSICO', 'REGIONAL', 'CASEIRO', 'RUSTICO', 'POPULAR', 'CASUAL', 'PIZZARIA', 'FAST_FOOD', 'COMIDA_DE_RUA', 'REFINADO', 'SAUDAVEL', 'FESTIVO', 'CONTEMPORANEO', 'OUTRO');

-- CreateEnum
CREATE TYPE "CookingMethodType" AS ENUM ('COZIDO', 'ENSOPADO', 'COCCAO_LENTA', 'ASSADO', 'FRITO', 'GRELHADO', 'CHAPA', 'VAPOR', 'REFOGADO', 'MONTAGEM', 'CRU', 'LIQUIDIFICADO', 'FERMENTADO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ServingTemperatureType" AS ENUM ('QUENTE', 'MORNO', 'FRIO', 'GELADO', 'AMBIENTE');

-- CreateEnum
CREATE TYPE "ConsumptionOccasionType" AS ENUM ('CAFE_DA_MANHA', 'ALMOCO', 'JANTAR', 'LANCHE', 'SOBREMESA', 'EVENTO', 'FAMILIAR', 'COMPARTILHAMENTO', 'FESTA', 'PIQUENIQUE', 'OUTRA');

-- CreateEnum
CREATE TYPE "UnitOfMeasure" AS ENUM ('G', 'KG', 'ML', 'L', 'XICARA', 'COLHER_CAFE', 'COLHER_CHA', 'COLHER_SOPA', 'UNIDADE', 'PITADA', 'A_GOSTO');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "story" TEXT,
    "coverImageUrl" TEXT,
    "coverImageKey" TEXT,
    "imageAlt" TEXT,
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "totalTimeMinutes" INTEGER,
    "servings" INTEGER,
    "caloriesPerServing" INTEGER,
    "utensils" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aiGeneratedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aiModelUsed" TEXT,
    "aiLastEnrichedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_classification" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "category" "RecipeCategory" NOT NULL,
    "complexity" "DifficultyLevel" NOT NULL,
    "cuisines" "CuisineType"[] DEFAULT ARRAY[]::"CuisineType"[],
    "flavors" "FlavorType"[] DEFAULT ARRAY[]::"FlavorType"[],
    "styles" "StyleType"[] DEFAULT ARRAY[]::"StyleType"[],
    "cookingMethods" "CookingMethodType"[] DEFAULT ARRAY[]::"CookingMethodType"[],
    "servingTemperatures" "ServingTemperatureType"[] DEFAULT ARRAY[]::"ServingTemperatureType"[],
    "consumptionOccasions" "ConsumptionOccasionType"[] DEFAULT ARRAY[]::"ConsumptionOccasionType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_classification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_nutrition" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "portionDescription" TEXT,
    "portionGrams" DECIMAL(8,2),
    "caloriesKcal" DECIMAL(10,2),
    "carbohydratesG" DECIMAL(10,2),
    "proteinsG" DECIMAL(10,2),
    "totalFatG" DECIMAL(10,2),
    "saturatedFatG" DECIMAL(10,2),
    "transFatG" DECIMAL(10,2),
    "monounsaturatedFatG" DECIMAL(10,2),
    "polyunsaturatedFatG" DECIMAL(10,2),
    "cholesterolMg" DECIMAL(10,2),
    "fiberG" DECIMAL(10,2),
    "sugarsG" DECIMAL(10,2),
    "addedSugarsG" DECIMAL(10,2),
    "sodiumMg" DECIMAL(10,2),
    "potassiumMg" DECIMAL(10,2),
    "calciumMg" DECIMAL(10,2),
    "ironMg" DECIMAL(10,2),
    "vitaminAMcg" DECIMAL(10,2),
    "vitaminCMg" DECIMAL(10,2),
    "vitaminDMcg" DECIMAL(10,2),
    "vitaminB12Mcg" DECIMAL(10,2),
    "magnesiumMg" DECIMAL(10,2),
    "zincMg" DECIMAL(10,2),
    "notes" TEXT,
    "generatedByAi" BOOLEAN NOT NULL DEFAULT false,
    "confidence" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_step" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredient" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepId" TEXT,
    "name" TEXT NOT NULL,
    "quantityText" TEXT,
    "quantityValue" DECIMAL(10,2),
    "unit" "UnitOfMeasure",
    "notes" TEXT,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_instruction" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepId" TEXT,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_instruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_substitution" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "ingredientName" TEXT NOT NULL,
    "originalIngredient" TEXT,
    "suggestedSubstitute" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_substitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_image" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ai_job" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "inputHash" TEXT,
    "status" TEXT NOT NULL,
    "promptVersion" TEXT,
    "responseJson" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipe_ai_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "account_providerId_accountId_idx" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_slug_key" ON "recipe"("slug");

-- CreateIndex
CREATE INDEX "recipe_authorId_idx" ON "recipe"("authorId");

-- CreateIndex
CREATE INDEX "recipe_publishedAt_idx" ON "recipe"("publishedAt");

-- CreateIndex
CREATE INDEX "recipe_title_idx" ON "recipe"("title");

-- CreateIndex
CREATE INDEX "recipe_createdAt_idx" ON "recipe"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_classification_recipeId_key" ON "recipe_classification"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_nutrition_recipeId_key" ON "recipe_nutrition"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_step_recipeId_idx" ON "recipe_step"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_step_recipeId_position_key" ON "recipe_step"("recipeId", "position");

-- CreateIndex
CREATE INDEX "recipe_ingredient_recipeId_idx" ON "recipe_ingredient"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_ingredient_stepId_idx" ON "recipe_ingredient"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredient_recipeId_stepId_position_key" ON "recipe_ingredient"("recipeId", "stepId", "position");

-- CreateIndex
CREATE INDEX "recipe_instruction_recipeId_idx" ON "recipe_instruction"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_instruction_stepId_idx" ON "recipe_instruction"("stepId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_instruction_recipeId_stepId_position_key" ON "recipe_instruction"("recipeId", "stepId", "position");

-- CreateIndex
CREATE INDEX "recipe_substitution_recipeId_idx" ON "recipe_substitution"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_image_r2Key_key" ON "recipe_image"("r2Key");

-- CreateIndex
CREATE INDEX "recipe_image_recipeId_idx" ON "recipe_image"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_image_recipeId_position_key" ON "recipe_image"("recipeId", "position");

-- CreateIndex
CREATE INDEX "recipe_ai_job_recipeId_idx" ON "recipe_ai_job"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_ai_job_requestedByUserId_idx" ON "recipe_ai_job"("requestedByUserId");

-- CreateIndex
CREATE INDEX "recipe_ai_job_status_idx" ON "recipe_ai_job"("status");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_classification" ADD CONSTRAINT "recipe_classification_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_nutrition" ADD CONSTRAINT "recipe_nutrition_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_step" ADD CONSTRAINT "recipe_step_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "recipe_ingredient_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "recipe_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_instruction" ADD CONSTRAINT "recipe_instruction_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_instruction" ADD CONSTRAINT "recipe_instruction_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "recipe_step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_substitution" ADD CONSTRAINT "recipe_substitution_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_image" ADD CONSTRAINT "recipe_image_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ai_job" ADD CONSTRAINT "recipe_ai_job_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ai_job" ADD CONSTRAINT "recipe_ai_job_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
