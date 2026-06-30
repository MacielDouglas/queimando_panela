import crypto from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { R2_BUCKET_NAME, R2_PUBLIC_URL, r2 } from "@/lib/r2";
import { processRecipeImage } from "./process-recipe-image";

export type UploadedRecipeImage = {
  key: string;
  url: string;
  alt: string;
  contentType: string;
  sizeBytes: number;
  width: number;
  height: number;
  order: number;
  isCover: boolean;
};

/**
 * Gera a chave R2 para uma imagem de receita.
 * Formato: recipes/<recipeId>/<uuid>-<slug>.webp
 */
export function buildRecipeImageKey(
  recipeId: string,
  fileName?: string,
): string {
  const slug = (fileName ?? "image")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const id = crypto.randomUUID();
  return `recipes/${recipeId}/${id}-${slug || "image"}.webp`;
}

export function getRecipeImageUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Processa e faz upload de uma imagem de receita para o R2.
 * Retorna os metadados necessários para persistir em RecipeImage.
 */
export async function uploadRecipeImage(params: {
  recipeId: string;
  file: File;
  alt: string;
  order: number;
  isCover: boolean;
}): Promise<UploadedRecipeImage> {
  const processed = await processRecipeImage(params.file);
  const key = buildRecipeImageKey(params.recipeId, params.file.name);

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: processed.buffer,
      ContentType: processed.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    key,
    url: getRecipeImageUrl(key),
    alt: params.alt,
    contentType: processed.contentType,
    sizeBytes: processed.sizeBytes,
    width: processed.width,
    height: processed.height,
    order: params.order,
    isCover: params.isCover,
  };
}

/**
 * Remove uma única imagem do R2 por chave.
 */
export async function deleteRecipeImageByKey(key: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

/**
 * Remove múltiplas imagens do R2 em paralelo.
 * Usa Promise.allSettled para não abortar caso uma remoção falhe.
 * Loga erros individuais sem lançar exceção, pois remoção de /temp/
 * em rollback não deve interromper o fluxo de erro original.
 */
export async function deleteRecipeImagesByKeys(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const results = await Promise.allSettled(
    keys.map((key) => deleteRecipeImageByKey(key)),
  );

  for (const [index, result] of results.entries()) {
    if (result.status === "rejected") {
      console.error(
        `[recipe-image.service] Falha ao remover imagem "${keys[index]}":`,
        result.reason,
      );
    }
  }
}
