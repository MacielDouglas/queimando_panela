import { randomUUID } from 'node:crypto';
import { uploadObjectToR2, deleteObjectFromR2 } from '@/server/storage/r2';
import { processRecipeImage } from '@/server/images/process-recipe-image';

export type UploadedRecipeImage = {
  key: string;
  url: string;
  alt: string;
  contentType: 'image/webp';
  sizeBytes: number;
  width: number;
  height: number;
  isCover: boolean;
  order: number;
};

export async function uploadRecipeCoverImage(params: {
  recipeId: string;
  file: File | null;
  alt: string;
}): Promise<UploadedRecipeImage | null> {
  const processed = await processRecipeImage(params.file);

  if (!processed) return null;

  const uploaded = await uploadObjectToR2({
    key: `recipes/${params.recipeId}/cover-${randomUUID()}.webp`,
    body: processed.buffer,
    contentType: processed.contentType,
  });

  return {
    key: uploaded.key,
    url: uploaded.url,
    alt: params.alt,
    contentType: processed.contentType,
    sizeBytes: processed.sizeBytes,
    width: processed.width,
    height: processed.height,
    isCover: true,
    order: 0,
  };
}

export async function safeDeleteRecipeImage(key: string) {
  try {
    await deleteObjectFromR2(key);
  } catch (error) {
    console.error('Erro ao deletar imagem do R2:', error);
  }
}
