-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('EASY', 'EASY_MEDIUM', 'MEDIUM', 'MEDIUM_HARD', 'HARD');

-- CreateTable
CREATE TABLE "Recipe" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "title" VARCHAR(180) NOT NULL,
    "summary" VARCHAR(500),
    "story" TEXT,
    "modeOfPreparation" TEXT,
    "difficulty" "RecipeDifficulty" NOT NULL,
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "servings" INTEGER,
    "suggestions" TEXT,
    "notesAuthor" TEXT,
    "notesPublic" TEXT,
    "nutritionSummary" TEXT,
    "nutritionPer100g" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" UUID NOT NULL,
    "classificationId" UUID,
    "worldOriginId" UUID,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeClassification" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorldOrigin" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorldOrigin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeSection" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ingredientsText" TEXT,
    "modeOfPreparation" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "sectionId" UUID,
    "generalIngredientId" UUID,
    "measurementUnitId" UUID,
    "amount" TEXT,
    "unitText" TEXT,
    "name" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "pluralLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralIngredient" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTypeOnRecipe" (
    "recipeId" UUID NOT NULL,
    "recipeTypeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeTypeOnRecipe_pkey" PRIMARY KEY ("recipeId","recipeTypeId")
);

-- CreateTable
CREATE TABLE "RecipeImage" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utensil" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utensil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UtensilOnRecipe" (
    "recipeId" UUID NOT NULL,
    "utensilId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UtensilOnRecipe_pkey" PRIMARY KEY ("recipeId","utensilId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "userId" UUID,
    "rating" INTEGER,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- CreateIndex
CREATE INDEX "Recipe_authorId_idx" ON "Recipe"("authorId");

-- CreateIndex
CREATE INDEX "Recipe_classificationId_idx" ON "Recipe"("classificationId");

-- CreateIndex
CREATE INDEX "Recipe_worldOriginId_idx" ON "Recipe"("worldOriginId");

-- CreateIndex
CREATE INDEX "Recipe_isPublished_publishedAt_idx" ON "Recipe"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "Recipe_difficulty_idx" ON "Recipe"("difficulty");

-- CreateIndex
CREATE INDEX "Recipe_createdAt_idx" ON "Recipe"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeClassification_name_key" ON "RecipeClassification"("name");

-- CreateIndex
CREATE INDEX "RecipeClassification_name_idx" ON "RecipeClassification"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WorldOrigin_name_key" ON "WorldOrigin"("name");

-- CreateIndex
CREATE INDEX "WorldOrigin_name_idx" ON "WorldOrigin"("name");

-- CreateIndex
CREATE INDEX "RecipeSection_recipeId_idx" ON "RecipeSection"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeSection_recipeId_order_idx" ON "RecipeSection"("recipeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeSection_recipeId_order_key" ON "RecipeSection"("recipeId", "order");

-- CreateIndex
CREATE INDEX "Ingredient_recipeId_idx" ON "Ingredient"("recipeId");

-- CreateIndex
CREATE INDEX "Ingredient_sectionId_idx" ON "Ingredient"("sectionId");

-- CreateIndex
CREATE INDEX "Ingredient_generalIngredientId_idx" ON "Ingredient"("generalIngredientId");

-- CreateIndex
CREATE INDEX "Ingredient_measurementUnitId_idx" ON "Ingredient"("measurementUnitId");

-- CreateIndex
CREATE INDEX "Ingredient_recipeId_order_idx" ON "Ingredient"("recipeId", "order");

-- CreateIndex
CREATE INDEX "Ingredient_sectionId_order_idx" ON "Ingredient"("sectionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_code_key" ON "MeasurementUnit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_label_key" ON "MeasurementUnit"("label");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_pluralLabel_key" ON "MeasurementUnit"("pluralLabel");

-- CreateIndex
CREATE INDEX "MeasurementUnit_label_idx" ON "MeasurementUnit"("label");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralIngredient_name_key" ON "GeneralIngredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeType_name_key" ON "RecipeType"("name");

-- CreateIndex
CREATE INDEX "RecipeTypeOnRecipe_recipeTypeId_idx" ON "RecipeTypeOnRecipe"("recipeTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeImage_key_key" ON "RecipeImage"("key");

-- CreateIndex
CREATE INDEX "RecipeImage_recipeId_idx" ON "RecipeImage"("recipeId");

-- CreateIndex
CREATE INDEX "RecipeImage_recipeId_isCover_idx" ON "RecipeImage"("recipeId", "isCover");

-- CreateIndex
CREATE INDEX "RecipeImage_recipeId_order_idx" ON "RecipeImage"("recipeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Utensil_name_key" ON "Utensil"("name");

-- CreateIndex
CREATE INDEX "UtensilOnRecipe_utensilId_idx" ON "UtensilOnRecipe"("utensilId");

-- CreateIndex
CREATE INDEX "Comment_recipeId_idx" ON "Comment"("recipeId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_userId_expiresAt_idx" ON "session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "account_providerId_idx" ON "account"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "verification_expiresAt_idx" ON "verification"("expiresAt");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "RecipeClassification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_worldOriginId_fkey" FOREIGN KEY ("worldOriginId") REFERENCES "WorldOrigin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSection" ADD CONSTRAINT "RecipeSection_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "RecipeSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_generalIngredientId_fkey" FOREIGN KEY ("generalIngredientId") REFERENCES "GeneralIngredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTypeOnRecipe" ADD CONSTRAINT "RecipeTypeOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTypeOnRecipe" ADD CONSTRAINT "RecipeTypeOnRecipe_recipeTypeId_fkey" FOREIGN KEY ("recipeTypeId") REFERENCES "RecipeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeImage" ADD CONSTRAINT "RecipeImage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtensilOnRecipe" ADD CONSTRAINT "UtensilOnRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UtensilOnRecipe" ADD CONSTRAINT "UtensilOnRecipe_utensilId_fkey" FOREIGN KEY ("utensilId") REFERENCES "Utensil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
