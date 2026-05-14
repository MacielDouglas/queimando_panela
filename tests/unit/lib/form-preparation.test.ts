import { describe, expect, it } from 'vitest';
import { formatPreparation } from '@/lib/form-preparation';

describe('formatPreparation', () => {
  it('retorna o texto original se vazio', () => {
    expect(formatPreparation('')).toBe('');
  });

  it('divide frases em parágrafos separados por \\n\\n', () => {
    const result = formatPreparation('Amasse as bananas. Misture com ovos. Leve ao forno.');

    expect(result).toBe('Amasse as bananas.\n\nMisture com ovos.\n\nLeve ao forno.');
  });

  it('normaliza quebras de linha existentes antes de dividir', () => {
    const result = formatPreparation('Amasse as bananas.\nMisture com ovos.');
    expect(result).toBe('Amasse as bananas.\n\nMisture com ovos.');
  });

  it('remove linhas em branco extras resultantes do split', () => {
    const result = formatPreparation('Passo A. Passo B.');
    const paragraphs = result.split('\n\n').filter(Boolean);
    expect(paragraphs).toHaveLength(2);
  });
});
