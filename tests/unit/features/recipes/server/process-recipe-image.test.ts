import { beforeEach, describe, expect, it, vi } from 'vitest';

const { sharpMock, metadataMock, resizeMock, cloneMock } = vi.hoisted(() => {
  const metadataMock = vi.fn();
  const resizeMock = vi.fn();
  const cloneMock = vi.fn();

  const sharpMock = vi.fn((input?: Buffer) => {
    if (input && input.equals(Buffer.from('candidate-ok'))) {
      return {
        metadata: vi.fn().mockResolvedValue({ width: 1200, height: 900 }),
      };
    }

    if (input && input.equals(Buffer.from('fallback-ok'))) {
      return {
        metadata: vi.fn().mockResolvedValue({ width: 1600, height: 1200 }),
      };
    }

    const rootChain = {
      rotate: vi.fn(),
      metadata: metadataMock,
      resize: resizeMock,
      clone: cloneMock,
    };

    rootChain.rotate.mockReturnValue(rootChain);
    rootChain.resize.mockReturnValue(rootChain);

    return rootChain;
  });

  return {
    sharpMock,
    metadataMock,
    resizeMock,
    cloneMock,
  };
});

vi.mock('sharp', () => ({
  default: sharpMock,
}));

import { processRecipeImage } from '@/features/recipes/server/process-recipe-image';

describe('processRecipeImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lança erro para arquivo não imagem', async () => {
    const file = new File(['abc'], 'arquivo.pdf', {
      type: 'application/pdf',
    });

    await expect(processRecipeImage(file)).rejects.toThrow(
      /^Formato de arquivo inválido\.$/,
    );
  });

  it('processa imagem sem resize quando dimensões estão dentro do limite', async () => {
    metadataMock.mockResolvedValue({ width: 1200, height: 900 });

    cloneMock.mockReturnValue({
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from('candidate-ok')),
    });

    const file = new File([new Uint8Array([1, 2, 3])], 'foto.png', {
      type: 'image/png',
    });

    const result = await processRecipeImage(file);

    expect(resizeMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      buffer: Buffer.from('candidate-ok'),
      contentType: 'image/webp',
      sizeBytes: Buffer.from('candidate-ok').byteLength,
      width: 1200,
      height: 900,
    });
  });

  it('faz resize quando a imagem excede a dimensão máxima', async () => {
    metadataMock.mockResolvedValue({ width: 3000, height: 2400 });

    cloneMock.mockReturnValue({
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from('candidate-ok')),
    });

    const file = new File([new Uint8Array([1, 2, 3])], 'grande.png', {
      type: 'image/png',
    });

    await processRecipeImage(file);

    expect(resizeMock).toHaveBeenCalledWith(2200, 2200, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  });

  it('usa fallback quando todas as qualidades iniciais excedem 3 MB', async () => {
    metadataMock.mockResolvedValue({ width: 3000, height: 2400 });

    const oversized = Buffer.alloc(3 * 1024 * 1024 + 1, 1);
    const fallback = Buffer.from('fallback-ok');

    const cloneForLoop = {
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(oversized),
    };

    const cloneFallback = {
      resize: vi.fn().mockReturnThis(),
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(fallback),
    };

    cloneMock
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneFallback);

    const file = new File([new Uint8Array([1, 2, 3])], 'grande.png', {
      type: 'image/png',
    });

    const result = await processRecipeImage(file);

    expect(result).toEqual({
      buffer: fallback,
      contentType: 'image/webp',
      sizeBytes: fallback.byteLength,
      width: 1600,
      height: 1200,
    });
  });

  it('lança erro quando nem o fallback reduz para até 3 MB', async () => {
    metadataMock.mockResolvedValue({ width: 3000, height: 2400 });

    const oversized = Buffer.alloc(3 * 1024 * 1024 + 1, 1);

    const cloneForLoop = {
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(oversized),
    };

    const cloneFallback = {
      resize: vi.fn().mockReturnThis(),
      webp: vi.fn().mockReturnThis(),
      toBuffer: vi.fn().mockResolvedValue(oversized),
    };

    cloneMock
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneForLoop)
      .mockReturnValueOnce(cloneFallback);

    const file = new File([new Uint8Array([1, 2, 3])], 'grande.png', {
      type: 'image/png',
    });

    await expect(processRecipeImage(file)).rejects.toThrow(
      /^Não foi possível reduzir a imagem para até 3 MB\.$/,
    );
  });
});
