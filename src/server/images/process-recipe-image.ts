import sharp from 'sharp';

const MAX_OUTPUT_BYTES = 3 * 1024 * 1024;
const MAX_DIMENSION = 2000;

export class RecipeImageError extends Error {}

export type ProcessedRecipeImage = {
  buffer: Buffer;
  contentType: 'image/webp';
  extension: 'webp';
  sizeBytes: number;
  width: number;
  height: number;
};

function isImageFile(file: File | null): file is File {
  return !!file && file.size > 0 && file.type.startsWith('image/');
}

export async function processRecipeImage(file: File | null): Promise<ProcessedRecipeImage | null> {
  if (!isImageFile(file)) return null;

  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  let quality = 82;
  let output = await sharp(inputBuffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 6,
    })
    .toBuffer({ resolveWithObject: true });

  while (output.data.byteLength > MAX_OUTPUT_BYTES && quality > 40) {
    quality -= 8;
    output = await sharp(inputBuffer)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 6,
      })
      .toBuffer({ resolveWithObject: true });
  }

  if (output.data.byteLength > MAX_OUTPUT_BYTES) {
    throw new RecipeImageError(
      'Não foi possível otimizar a imagem para até 3 MB. Tente outra imagem.',
    );
  }

  const metadata = await sharp(output.data).metadata();

  if (!metadata.width || !metadata.height) {
    throw new RecipeImageError('Não foi possível identificar as dimensões da imagem.');
  }

  return {
    buffer: output.data,
    contentType: 'image/webp',
    extension: 'webp',
    sizeBytes: output.data.byteLength,
    width: metadata.width,
    height: metadata.height,
  };
}
