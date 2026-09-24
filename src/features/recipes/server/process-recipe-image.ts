import sharp from 'sharp';

export type ProcessedRecipeImage = {
  buffer: Buffer;
  contentType: 'image/webp';
  sizeBytes: number;
  width: number;
  height: number;
};

const MAX_BYTES = 3 * 1024 * 1024;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1600;

export const MAX_RECIPE_IMAGE_BYTES = MAX_BYTES;
export const MAX_RECIPE_IMAGE_INPUT_BYTES = MAX_INPUT_BYTES;

export async function processRecipeImage(
  file: File,
): Promise<ProcessedRecipeImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Formato de arquivo inválido.');
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande. Envie arquivo de até 10 MB.');
  }

  const input = Buffer.from(await file.arrayBuffer());

  if (input.byteLength > MAX_INPUT_BYTES) {
    throw new Error('Imagem muito grande. Envie arquivo de até 10 MB.');
  }

  let pipeline = sharp(input, { animated: false }).rotate();
  const metadata = await pipeline.metadata();

  const width = metadata.width ?? MAX_DIMENSION;
  const height = metadata.height ?? MAX_DIMENSION;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    pipeline = pipeline.resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let output: Buffer | null = null;
  let finalMeta: sharp.Metadata | null = null;

  // 3 passes cobrem 95% dos casos com 1/3 do custo CPU anterior (8 passes).
  for (const quality of [80, 68, 55]) {
    const candidate = await pipeline
      .clone()
      .webp({
        quality,
        effort: 4,
      })
      .toBuffer();

    if (candidate.byteLength <= MAX_BYTES) {
      output = candidate;
      finalMeta = await sharp(candidate).metadata();
      break;
    }
  }

  if (!output) {
    const fallback = await pipeline
      .clone()
      .resize(1280, 1280, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 50,
        effort: 4,
      })
      .toBuffer();

    if (fallback.byteLength > MAX_BYTES) {
      throw new Error('Não foi possível reduzir a imagem para até 3 MB.');
    }

    output = fallback;
    finalMeta = await sharp(fallback).metadata();
  }

  return {
    buffer: output,
    contentType: 'image/webp',
    sizeBytes: output.byteLength,
    width: finalMeta?.width ?? 0,
    height: finalMeta?.height ?? 0,
  };
}
