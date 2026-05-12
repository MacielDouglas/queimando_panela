import { describe, expect, it } from 'vitest';
import { slugify } from '@/lib/slugify';

describe('slugify', () => {
  it('transforma título em slug minúsculo com hífens', () => {
    expect(slugify('Bolo de Banana')).toBe('bolo-de-banana');
  });

  it('remove acentos e cedilha', () => {
    expect(slugify('Frango à Portuguesa')).toBe('frango-a-portuguesa');
    expect(slugify('Açúcar mascavo')).toBe('acucar-mascavo');
  });

  it('remove caracteres especiais', () => {
    expect(slugify('Creme brûlée 100%!')).toBe('creme-brulee-100');
  });

  it('colapsa múltiplos espaços e hífens', () => {
    expect(slugify('  Bolo   de  Cenoura  ')).toBe('bolo-de-cenoura');
  });

  it('retorna string vazia para input vazio', () => {
    expect(slugify('')).toBe('');
  });
});
