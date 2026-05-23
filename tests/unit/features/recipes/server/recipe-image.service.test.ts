import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendMock = vi.fn();
const processRecipeImageMock = vi.fn();
const randomUUIDMock = vi.fn();

vi.mock('node:crypto', () => ({
  default: {
    randomUUID: () => randomUUIDMock(),
  },
}));

vi.mock('@/lib/r2', () => ({
  r2: {
    send: (...args: unknown[]) => sendMock(...args),
  },
  R2_BUCKET_NAME: 'bucket-test',
  R2_PUBLIC_URL: 'https://cdn.example.com',
}));

vi.mock('@/features/recipes/server/process-recipe-image', () => ({
  processRecipeImage: (...args: unknown[]) => processRecipeImageMock(...args),
}));

import {
  buildRecipeImageKey,
  deleteRecipeImageByKey,
  deleteRecipeImagesByKeys,
  getRecipeImageUrl,
  uploadRecipeImage,
} from '@/features/recipes/server/recipe-image.service';

describe('recipe-image.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    randomUUIDMock.mockReturnValue('uuid-123');
  });

  it('gera key normalizada com recipeId e extensão webp', () => {
    const key = buildRecipeImageKey('recipe-1', 'Bolo de Fubá Especial!!.PNG');

    expect(key).toBe(
      'recipes/recipe-1/uuid-123-bolo-de-fuba-especial-.png.webp',
    );
  });

  it('gera URL pública da imagem', () => {
    expect(getRecipeImageUrl('recipes/abc/file.webp')).toBe(
      'https://cdn.example.com/recipes/abc/file.webp',
    );
  });

  it('faz upload da imagem processada ao R2 e retorna metadados', async () => {
    processRecipeImageMock.mockResolvedValue({
      buffer: Buffer.from('webp'),
      contentType: 'image/webp',
      sizeBytes: 1234,
      width: 800,
      height: 600,
    });

    const file = new File(['raw'], 'foto.png', { type: 'image/png' });

    const result = await uploadRecipeImage({
      recipeId: 'recipe-1',
      file,
      alt: 'Foto principal',
      order: 0,
      isCover: true,
    });

    expect(processRecipeImageMock).toHaveBeenCalledWith(file);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const command = sendMock.mock.calls[0][0];
    expect(command.input).toEqual({
      Bucket: 'bucket-test',
      Key: 'recipes/recipe-1/uuid-123-foto.png.webp',
      Body: Buffer.from('webp'),
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    });

    expect(result).toEqual({
      key: 'recipes/recipe-1/uuid-123-foto.png.webp',
      url: 'https://cdn.example.com/recipes/recipe-1/uuid-123-foto.png.webp',
      alt: 'Foto principal',
      contentType: 'image/webp',
      sizeBytes: 1234,
      width: 800,
      height: 600,
      order: 0,
      isCover: true,
    });
  });

  it('deleta uma imagem por key', async () => {
    await deleteRecipeImageByKey('recipes/recipe-1/file.webp');

    expect(sendMock).toHaveBeenCalledTimes(1);

    const command = sendMock.mock.calls[0][0];
    expect(command.input).toEqual({
      Bucket: 'bucket-test',
      Key: 'recipes/recipe-1/file.webp',
    });
  });

  it('deleta múltiplas imagens em sequência', async () => {
    await deleteRecipeImagesByKeys([
      'recipes/recipe-1/1.webp',
      'recipes/recipe-1/2.webp',
    ]);

    expect(sendMock).toHaveBeenCalledTimes(2);
  });
});
