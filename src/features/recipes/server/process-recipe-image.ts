import sharp from 'sharp';

export type ProcessedRecipeImage = {
  buffer: Buffer;
  contentType: 'image/webp';
  sizeBytes: number;
  width: number;
  height: number;
};

const MAX_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 2200;

export async function processRecipeImage(
  file: File,
): Promise<ProcessedRecipeImage> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Formato de arquivo inválido.');
  }

  const input = Buffer.from(await file.arrayBuffer());

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

  for (const quality of [82, 76, 70, 64, 58, 52, 46, 40]) {
    const candidate = await pipeline
      .clone()
      .webp({
        quality,
        effort: 5,
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
      .resize(1600, 1600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 38,
        effort: 6,
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
