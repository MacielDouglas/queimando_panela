import crypto from 'node:crypto';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { getR2BucketName, getR2PublicUrl, r2 } from '@/lib/r2';
import { processRecipeImage } from './process-recipe-image';

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

export function buildRecipeImageKey(recipeId: string, fileName?: string) {
  const slug = (fileName ?? 'image')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  const id = crypto.randomUUID();
  return `recipes/${recipeId}/${id}-${slug || 'image'}.webp`;
}

export function getRecipeImageUrl(key: string) {
  return `${getR2PublicUrl()}/${key}`;
}

export async function uploadRecipeImage(params: {
  recipeId: string;
  file: File;
  alt: string;
  order: number;
  isCover: boolean;
}) {
  const processed = await processRecipeImage(params.file);
  const key = buildRecipeImageKey(params.recipeId, params.file.name);

  await r2.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: processed.buffer,
      ContentType: processed.contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  const uploaded: UploadedRecipeImage = {
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

  return uploaded;
}

export async function deleteRecipeImageByKey(key: string) {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    }),
  );
}

export async function deleteRecipeImagesByKeys(keys: string[]) {
  for (const key of keys) {
    await deleteRecipeImageByKey(key);
  }
}
