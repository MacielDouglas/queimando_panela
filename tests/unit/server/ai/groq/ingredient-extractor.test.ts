// tests/unit/server/ai/groq/ingredient-extractor.test.ts

import { extractJsonFromContent } from '@/server/ai/groq/ingredient-extractor';
import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

const mockResponseBody = JSON.stringify({
  choices: [
    {
      message: {
        content: JSON.stringify({
          ingredients: [
            {
              name: 'ovo',
              amount: '1',
              unit: '',
              originalText: 'um ovo',
              inferred: false,
              suggestions: [],
            },
          ],
          utensils: [{ name: 'tigela' }],
          classification: {
            primaryGroup: 'PROTEÍNAS',
            mainCategories: ['ovo'],
            nutritionTags: [],
            courseTypes: ['café da manhã'],
          },
        }),
      },
    },
  ],
});

describe('extractIngredientsAndUtensilsFromGroq', () => {
  beforeAll(() => {
    process.env.GROQ_API_KEY = 'test-key-fake';

    // Mocka fetch global para interceptar a chamada à API da Groq
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => JSON.parse(mockResponseBody),
      }),
    );
  });

  afterAll(() => {
    delete process.env.GROQ_API_KEY;
    vi.unstubAllGlobals();
  });

  it('retorna estrutura completa com ingredientes, utensílios e classificação', async () => {
    const { extractIngredientsAndUtensilsFromGroq } =
      await import('@/server/ai/groq/ingredient-extractor');

    const result = await extractIngredientsAndUtensilsFromGroq('Bata um ovo em uma tigela.');

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]?.name).toBe('ovo');
    expect(result.utensils).toHaveLength(1);
    expect(result.utensils[0]?.name).toBe('tigela');
    expect(result.classification.primaryGroup).toBe('PROTEÍNAS');
  });

  it('lança erro quando GROQ_API_KEY não está configurado', async () => {
    delete process.env.GROQ_API_KEY;
    const { extractIngredientsAndUtensilsFromGroq } =
      await import('@/server/ai/groq/ingredient-extractor');
    await expect(extractIngredientsAndUtensilsFromGroq('qualquer texto')).rejects.toThrow(
      'GROQ_API_KEY não configurado no ambiente.',
    );
    process.env.GROQ_API_KEY = 'test-key-fake'; // restaura para os outros testes
  });

  it('lança erro quando a API retorna status de erro', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      }),
    );

    const { extractIngredientsAndUtensilsFromGroq } =
      await import('@/server/ai/groq/ingredient-extractor');
    await expect(extractIngredientsAndUtensilsFromGroq('qualquer texto')).rejects.toThrow(
      'Falha na chamada à Groq API (status 500).',
    );
  });
});

describe('extractJsonFromContent', () => {
  it('retorna JSON puro sem alteração', () => {
    const raw = '{"ingredients": []}';
    expect(extractJsonFromContent(raw)).toBe('{"ingredients": []}');
  });

  it('remove markdown fence com ```json', () => {
    const raw = '```json\n{"ingredients": []}\n```';
    expect(extractJsonFromContent(raw)).toBe('{"ingredients": []}');
  });

  it('remove markdown fence sem identificador de linguagem', () => {
    const raw = '```\n{"ingredients": []}\n```';
    expect(extractJsonFromContent(raw)).toBe('{"ingredients": []}');
  });

  it('lida com espaços extras dentro do fence', () => {
    const raw = '```json\n  {"ingredients": []}  \n```';
    expect(extractJsonFromContent(raw)).toBe('{"ingredients": []}');
  });

  it('lida com conteúdo multiline dentro do fence', () => {
    const raw = '```json\n{\n  "ingredients": [],\n  "utensils": []\n}\n```';
    const result = extractJsonFromContent(raw);
    expect(result).toContain('"ingredients"');
    expect(result).toContain('"utensils"');
  });
});
