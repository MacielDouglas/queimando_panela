"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  deleteRecipeImagesByKeys,
  uploadRecipeImage,
} from "@/features/recipes/server/recipe-image.service";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AiRecipeAnalysis } from "../types/recipe-ai.types";
import {
  buildRecipeCoreData,
  extractClassificationName,
  extractRecipeTypeNames,
  extractUtensilNames,
  extractWorldOriginName,
  normalizeLower,
  slugify,
} from "./recipe-core";
import {
  buildFinalImageSequence,
  type FinalNewImage,
} from "./recipe-imagem-helpers";

function parseAnalysis(
  raw: FormDataEntryValue | null,
): AiRecipeAnalysis | null {
  if (!raw || typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as AiRecipeAnalysis;
  } catch {
    return null;
  }
}

async function buildUniqueSlug(baseSlug: string): Promise<string> {
  let uniqueSlug = baseSlug;
  let attempt = 0;

  for (;;) {
    const existing = await prisma.recipe.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });
    if (!existing) return uniqueSlug;
    attempt += 1;
    uniqueSlug = `${baseSlug}-${attempt}`;
  }
}

export async function createRecipe(
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { error: "Não autorizado." };

  const analysis = parseAnalysis(formData.get("analysis"));
  if (!analysis) return { error: "Dados da receita inválidos." };

  const storyRaw = formData.get("story");
  const story =
    typeof storyRaw === "string" && storyRaw.trim()
      ? storyRaw.trim()
      : undefined;

  const imageFiles = formData
    .getAll("images")
    .filter((v): v is File => v instanceof File && v.size > 0)
    .slice(0, 3);

  let uploadedImages: Awaited<ReturnType<typeof uploadRecipeImage>>[] = [];

  try {
    // 1) Upload em /temp antes da transaction (falhas aqui são limpas no catch)
    if (imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map((file, index) =>
          uploadRecipeImage({
            recipeId: "temp",
            file,
            alt: `${analysis.title} - foto ${index + 1}`,
            order: index,
            isCover: index === 0,
          }),
        ),
      );
    }

    // 2) Dados escalares e slug único
    const coreData = buildRecipeCoreData(analysis, story);
    const recipeTypeNames = extractRecipeTypeNames(analysis);
    const utensilNames = extractUtensilNames(analysis);
    const classificationName = extractClassificationName(analysis);
    const worldOriginName = extractWorldOriginName(analysis);
    const uniqueSlug = await buildUniqueSlug(slugify(analysis.title));

    const recipe = await prisma.$transaction(
      async (tx) => {
        // 3) Upsert RecipeClassification
        let classificationId: string | undefined;
        if (classificationName) {
          const cls = await tx.recipeClassification.upsert({
            where: { name: classificationName },
            update: {},
            create: { name: classificationName },
            select: { id: true },
          });
          classificationId = cls.id;
        }

        // 4) Upsert WorldOrigin
        let worldOriginId: string | undefined;
        if (worldOriginName) {
          const origin = await tx.worldOrigin.upsert({
            where: { name: worldOriginName },
            update: {},
            create: { name: worldOriginName },
            select: { id: true },
          });
          worldOriginId = origin.id;
        }

        // 5) Cria Recipe
        // originSummary passado UMA vez aqui, fora do spread coreData
        // para não colidir (coreData não inclui originSummary)
        const createdRecipe = await tx.recipe.create({
          data: {
            ...coreData,
            slug: uniqueSlug,
            isPublished: false,
            authorId: session.user.id,
            classificationId: classificationId ?? null,
            worldOriginId: worldOriginId ?? null,
            originSummary: worldOriginName ?? null,
          },
        });

        // 6) RecipeType + RecipeTypeOnRecipe
        if (recipeTypeNames.length > 0) {
          const recipeTypes = await Promise.all(
            recipeTypeNames.map((name) =>
              tx.recipeType.upsert({
                where: { name },
                update: {},
                create: { name },
                select: { id: true },
              }),
            ),
          );
          await tx.recipeTypeOnRecipe.createMany({
            data: recipeTypes.map((rt) => ({
              recipeId: createdRecipe.id,
              recipeTypeId: rt.id,
            })),
            skipDuplicates: true,
          });
        }

        // 7) Utensil + UtensilOnRecipe
        if (utensilNames.length > 0) {
          const utensils = await Promise.all(
            utensilNames.map((name) =>
              tx.utensil.upsert({
                where: { name },
                update: {},
                create: { name },
                select: { id: true },
              }),
            ),
          );
          await tx.utensilOnRecipe.createMany({
            data: utensils.map((u) => ({
              recipeId: createdRecipe.id,
              utensilId: u.id,
            })),
            skipDuplicates: true,
          });
        }

        // 8) RecipeSection + RecipeStep + Ingredient
        const createdSections = await Promise.all(
          analysis.sections.map((section, index) => {
            const sectionName =
              analysis.sections.length === 1
                ? "Receita"
                : section.name.trim() || `Etapa ${index + 1}`;

            const ingredientsText = section.ingredients
              .map((ing) => ing.originalText.trim())
              .filter(Boolean)
              .join("\n");

            return tx.recipeSection.create({
              data: {
                recipeId: createdRecipe.id,
                name: sectionName,
                modeOfPreparation: section.modeOfPreparation.trim(),
                ingredientsText: ingredientsText || null,
                order: index,
              },
            });
          }),
        );

        for (const [sectionIndex, section] of analysis.sections.entries()) {
          const createdSection = createdSections[sectionIndex];
          if (!createdSection) continue;

          // 8a) RecipeStep (quando a IA retorna passos estruturados)
          if (section.steps && section.steps.length > 0) {
            await tx.recipeStep.createMany({
              data: section.steps.map((step) => ({
                recipeId: createdRecipe.id,
                sectionId: createdSection.id,
                order: step.order,
                text: step.text.trim(),
              })),
              skipDuplicates: true,
            });
          }

          // 8b) Ingredient
          for (const [order, ingredient] of section.ingredients.entries()) {
            const generalName = normalizeLower(ingredient.generalName);

            const generalIngredient = generalName
              ? await tx.generalIngredient.upsert({
                  where: { name: generalName },
                  update: {},
                  create: { name: generalName },
                  select: { id: true },
                })
              : null;

            await tx.ingredient.create({
              data: {
                recipeId: createdRecipe.id,
                sectionId: createdSection.id,
                originalText: ingredient.originalText.trim(),
                name: ingredient.name.trim(),
                amount: null,
                unitText: null,
                order,
                generalIngredientId: generalIngredient?.id ?? null,
              },
            });
          }
        }

        // 9) RecipeImage (move de /temp/ para /<recipeId>/)
        if (uploadedImages.length > 0) {
          const finalImages = buildFinalImageSequence({
            title: analysis.title,
            existingImages: [],
            uploadedImages: uploadedImages.map((img) => ({
              ...img,
              key: img.key.replace("/temp/", `/${createdRecipe.id}/`),
              url: img.url.replace("/temp/", `/${createdRecipe.id}/`),
            })),
            maxImages: 3,
          });

          const finalNewImages = finalImages.filter(
            (img): img is FinalNewImage => img.kind === "new",
          );

          if (finalNewImages.length > 0) {
            await tx.recipeImage.createMany({
              data: finalNewImages.map((img) => ({
                recipeId: createdRecipe.id,
                key: img.key,
                url: img.url,
                alt: img.alt,
                contentType: img.contentType ?? null,
                sizeBytes: img.sizeBytes ?? null,
                width: img.width ?? null,
                height: img.height ?? null,
                order: img.order,
                isCover: img.isCover,
              })),
            });
          }
        }

        return createdRecipe;
      },
      { timeout: 15000 },
    );

    redirect(`/receitas/${recipe.slug}/editar`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (uploadedImages.length > 0) {
      await deleteRecipeImagesByKeys(
        uploadedImages.map((img) => img.key),
      ).catch(() => undefined);
    }

    console.error("Create recipe error:", error);
    return { error: "Erro ao criar a receita. Tente novamente." };
  }
}
