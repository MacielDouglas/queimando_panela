import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:crypto')>();
  return {
    ...actual,
    randomUUID: vi.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
  };
});

vi.mock('@/server/storage/r2', () => ({
  uploadObjectToR2: vi.fn(),
  deleteObjectFromR2: vi.fn(),
}));

vi.mock('@/server/images/process-recipe-image', () => ({
  processRecipeImage: vi.fn(),
}));

import {
  safeDeleteRecipeImage,
  uploadRecipeCoverImage,
} from '@/features/recipes/server/recipe-image.service';
import { uploadObjectToR2, deleteObjectFromR2 } from '@/server/storage/r2';
import { processRecipeImage } from '@/server/images/process-recipe-image';

describe('recipe-image.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna null quando processRecipeImage retorna null', async () => {
    vi.mocked(processRecipeImage).mockResolvedValue(null);

    const file = new File(['abc'], 'foto.png', { type: 'image/png' });

    const result = await uploadRecipeCoverImage({
      recipeId: 'recipe-123',
      file,
      alt: 'Capa',
    });

    expect(result).toBeNull();
    expect(uploadObjectToR2).not.toHaveBeenCalled();
  });

  it('faz upload da capa processada para o R2', async () => {
    vi.mocked(processRecipeImage).mockResolvedValue({
      buffer: Buffer.from([1, 2, 3]),
      contentType: 'image/webp',
      extension: 'webp',
      sizeBytes: 12345,
      width: 1200,
      height: 800,
    });

    vi.mocked(uploadObjectToR2).mockResolvedValue({
      key: 'recipes/recipe-123/cover-uuid.webp',
      url: 'https://cdn.example.com/recipes/recipe-123/cover-uuid.webp',
    });

    const file = new File(['abc'], 'foto.png', { type: 'image/png' });

    const result = await uploadRecipeCoverImage({
      recipeId: 'recipe-123',
      file,
      alt: 'Capa da receita',
    });

    expect(uploadObjectToR2).toHaveBeenCalledWith({
      key: expect.stringMatching(/^recipes\/recipe-123\/cover-.*\.webp$/),
      body: Buffer.from([1, 2, 3]),
      contentType: 'image/webp',
    });

    expect(result).toEqual({
      key: 'recipes/recipe-123/cover-uuid.webp',
      url: 'https://cdn.example.com/recipes/recipe-123/cover-uuid.webp',
      alt: 'Capa da receita',
      contentType: 'image/webp',
      sizeBytes: 12345,
      width: 1200,
      height: 800,
      isCover: true,
      order: 0,
    });
  });

  it('safeDeleteRecipeImage deleta imagem com sucesso', async () => {
    vi.mocked(deleteObjectFromR2).mockResolvedValue(undefined);

    await safeDeleteRecipeImage('recipes/recipe-123/cover.webp');

    expect(deleteObjectFromR2).toHaveBeenCalledWith('recipes/recipe-123/cover.webp');
  });

  it('safeDeleteRecipeImage não propaga erro', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(deleteObjectFromR2).mockRejectedValue(new Error('R2 down'));

    await expect(safeDeleteRecipeImage('recipes/recipe-123/cover.webp')).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
