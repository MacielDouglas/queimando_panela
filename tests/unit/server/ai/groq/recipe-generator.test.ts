import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { generateRecipeFromGroq } from '@/server/ai/groq/recipe-generator';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function mockGroqResponse(content: string) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      choices: [{ message: { content } }],
    }),
  } as never);
}

const minimalPayload = {
  modeOfPreparation: '1. Misture tudo.\n\n2. Asse por 30 minutos.',
  summary: 'Receita saborosa.',
  ingredients: [],
  utensils: [],
  classification: {
    primaryGroup: 'CARBOIDRATOS' as const,
    mainCategories: ['bolo'],
    nutritionTags: ['rico em açúcar'],
    courseTypes: ['sobremesa'],
    typeSuggestions: ['Bolo Simples'],
  },
  suggestions: 'Sirva com café.',
  difficulty: 'EASY' as const,
  cookTimeMinutes: 30,
  nutritionTable: [],
  nutritionSummary: 'Receita equilibrada.',
};

beforeEach(() => {
  vi.stubEnv('GROQ_API_KEY', 'test-key');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('generateRecipeFromGroq', () => {
  it('lança erro se GROQ_API_KEY não estiver definida', async () => {
    vi.stubEnv('GROQ_API_KEY', ''); // ← força vazio em vez de vi.unstubAllEnvs()
    await expect(generateRecipeFromGroq('Bolo', 'Misture tudo.')).rejects.toThrow(/GROQ_API_KEY/);
  });
  it('lança erro se a API retornar status de erro', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    } as never);

    await expect(generateRecipeFromGroq('Bolo', 'Misture tudo.')).rejects.toThrow(/status 500/i);
  });

  it('lança erro se a resposta não for JSON válido', async () => {
    mockGroqResponse('isso não é json');

    await expect(generateRecipeFromGroq('Bolo', 'Misture tudo.')).rejects.toThrow(/JSON válido/i);
  });

  it('retorna dados corretamente quando a IA responde com JSON válido', async () => {
    mockGroqResponse(JSON.stringify(minimalPayload));

    const result = await generateRecipeFromGroq('Bolo', '1. Misture tudo.\n2. Asse.');

    expect(result.modeOfPreparation).toBe(minimalPayload.modeOfPreparation);
    expect(result.difficulty).toBe('EASY');
    expect(result.cookTimeMinutes).toBe(30);
  });

  it('normaliza ingredients para array vazio quando ausente no JSON', async () => {
    mockGroqResponse(JSON.stringify({ ...minimalPayload, ingredients: undefined }));

    const result = await generateRecipeFromGroq('Bolo', 'Misture tudo e asse por 30 min.');
    expect(Array.isArray(result.ingredients)).toBe(true);
  });

  it('normaliza utensils para array vazio quando ausente', async () => {
    mockGroqResponse(JSON.stringify({ ...minimalPayload, utensils: undefined }));

    const result = await generateRecipeFromGroq('Bolo', 'Misture tudo e asse por 30 min.');
    expect(Array.isArray(result.utensils)).toBe(true);
  });

  it('usa MEDIUM como difficulty padrão quando valor inválido é retornado', async () => {
    mockGroqResponse(JSON.stringify({ ...minimalPayload, difficulty: 'INVALID_DIFFICULTY' }));

    const result = await generateRecipeFromGroq('Bolo', 'Misture tudo e asse por 30 min.');
    expect(result.difficulty).toBe('MEDIUM');
  });

  it('gera typeSuggestions a partir de mainCategories quando ausente', async () => {
    const payload = {
      ...minimalPayload,
      classification: {
        ...minimalPayload.classification,
        typeSuggestions: [],
        mainCategories: ['bolo', 'torta'],
      },
    };

    mockGroqResponse(JSON.stringify(payload));

    const result = await generateRecipeFromGroq('Bolo', 'Misture tudo e asse por 30 min.');
    expect(result.classification.typeSuggestions.length).toBeGreaterThan(0);
    expect(result.classification.typeSuggestions[0]).toMatch(/^[A-Z]/);
  });

  it('aceita resposta com JSON em bloco markdown fenced', async () => {
    const json = JSON.stringify(minimalPayload);
    mockGroqResponse(`\`\`\`json\n${json}\n\`\`\``);

    const result = await generateRecipeFromGroq('Bolo', 'Misture tudo e asse por 30 min.');
    expect(result.difficulty).toBe('EASY');
  });
});
