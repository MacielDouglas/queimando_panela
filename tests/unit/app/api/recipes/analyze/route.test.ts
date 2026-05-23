import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();

vi.mock('groq-sdk', () => {
  const GroqMock = vi.fn(
    class {
      chat = {
        completions: {
          create: (...args: unknown[]) => createMock(...args),
        },
      };
    },
  );

  return {
    default: GroqMock,
  };
});

describe('POST /api/recipes/analyze', () => {
  const originalEnv = process.env.GROQ_API_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  afterAll(() => {
    process.env.GROQ_API_KEY = originalEnv;
  });

  it('retorna 400 sem título', async () => {
    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: '',
        sections: [
          { name: 'Receita', ingredientsText: 'a', modeOfPreparation: 'b' },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Título e seções são obrigatórios.' });
  });

  it('retorna 400 sem sections', async () => {
    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Bolo',
        sections: [],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Título e seções são obrigatórios.' });
  });

  it('retorna 500 sem GROQ_API_KEY', async () => {
    process.env.GROQ_API_KEY = '';
    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Bolo',
        sections: [
          { name: 'Receita', ingredientsText: 'a', modeOfPreparation: 'b' },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: 'GROQ_API_KEY não configurada.' });
  });

  it('retorna dados parseados quando Groq responde com JSON válido', async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              '{"title":"Receita","summary":"Resumo","difficulty":"EASY","difficultyLabel":"Fácil","type":"Doce","prepTimeMinutes":10,"cookTimeMinutes":20,"suggestions":"Troca ingrediente","nutritionSummary":"Resumo nutri","nutritionPer100g":[{"nutrient":"Calorias","quantity":"100 kcal"}],"utensils":["Tigela"],"sections":[{"name":"Receita","ingredients":["2 ovos"],"modeOfPreparation":"1. Misture."}]}',
          },
        },
      ],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Receita',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 ovos',
            modeOfPreparation: 'Misture.',
          },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.title).toBe('Receita');
  });

  it('aceita resposta com texto antes e depois do JSON', async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              'Aqui está o resultado {"title":"Receita","summary":"Resumo","difficulty":"EASY","difficultyLabel":"Fácil","type":"Doce","prepTimeMinutes":10,"cookTimeMinutes":20,"suggestions":"Troca ingrediente","nutritionSummary":"Resumo nutri","nutritionPer100g":[{"nutrient":"Calorias","quantity":"100 kcal"}],"utensils":["Tigela"],"sections":[{"name":"Receita","ingredients":["2 ovos"],"modeOfPreparation":"1. Misture."}]} fim',
          },
        },
      ],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Receita',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 ovos',
            modeOfPreparation: 'Misture.',
          },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.title).toBe('Receita');
  });

  it('sanitiza quebras de linha inválidas dentro do JSON', async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: `{"title":"Receita","summary":"Linha 1
Linha 2","difficulty":"EASY","difficultyLabel":"Fácil","type":"Doce","prepTimeMinutes":10,"cookTimeMinutes":20,"suggestions":"Parágrafo 1

Parágrafo 2","nutritionSummary":"Resumo nutri","nutritionPer100g":[{"nutrient":"Calorias","quantity":"100 kcal"}],"utensils":["Tigela"],"sections":[{"name":"Receita","ingredients":["2 ovos"],"modeOfPreparation":"1. Misture.
2. Asse."}]}`,
          },
        },
      ],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Receita',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 ovos',
            modeOfPreparation: 'Misture.',
          },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.data.summary).toContain('Linha 1');
    expect(json.data.sections[0].modeOfPreparation).toContain('1. Misture.');
  });

  it('retorna 422 quando a IA responde sem JSON', async () => {
    createMock.mockResolvedValue({
      choices: [{ message: { content: 'sem objeto json aqui' } }],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Receita',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 ovos',
            modeOfPreparation: 'Misture.',
          },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json).toEqual({
      error: 'A resposta da IA veio em formato inválido.',
    });
  });

  it('retorna 500 quando Groq lança exceção', async () => {
    createMock.mockRejectedValue(new Error('groq down'));

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Receita',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 ovos',
            modeOfPreparation: 'Misture.',
          },
        ],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({
      error: 'Erro ao processar com a IA.',
    });
  });
});
