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
    process.env.GROQ_API_KEY = 'gsk_test-valid-key-for-unit-tests-1234567890';
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

    expect(response.status).toBe(503);
    expect(json).toEqual({
      error:
        'Serviço de IA indisponível. Configure GROQ_API_KEY em .env e na Vercel (https://console.groq.com/keys).',
    });
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

  it('repete a análise quando a primeira resposta não contém JSON', async () => {
    createMock
      .mockResolvedValueOnce({
        choices: [
          {
            message: { content: '' },
            finish_reason: 'length',
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              content:
                '{"title":"Receita","summary":"Resumo","difficulty":"EASY","difficultyLabel":"Fácil","types":["Doce"],"prepTimeMinutes":10,"cookTimeMinutes":20,"suggestions":"Troca ingrediente","nutritionSummary":"Resumo nutri","nutritionPer100g":[{"nutrient":"Calorias","quantity":"100 kcal"}],"utensils":["Tigela"],"sections":[{"name":"Receita","ingredients":[{"originalText":"2 ovos","name":"ovos","generalName":"ovo"}],"modeOfPreparation":"1. Misture."}]}',
            },
            finish_reason: 'stop',
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
    expect(createMock).toHaveBeenCalledTimes(2);

    const retryParams = createMock.mock.calls[1][0] as {
      messages: { content: string }[];
    };
    expect(retryParams.messages[0].content).toContain('CORREÇÃO OBRIGATÓRIA');
  });

  it('usa JSON mode, reasoning baixo e prompt com conversão de medidas', async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content:
              '{"title":"Receita","summary":"Resumo","difficulty":"EASY","difficultyLabel":"Fácil","types":["Doce"],"prepTimeMinutes":10,"cookTimeMinutes":20,"suggestions":"Troca ingrediente","nutritionSummary":"Resumo nutri","nutritionPer100g":[{"nutrient":"Calorias","quantity":"100 kcal"}],"utensils":["Tigela"],"sections":[{"name":"Receita","ingredients":[{"originalText":"2 ovos","name":"ovos","generalName":"ovo"}],"modeOfPreparation":"1. Misture."}]}',
          },
          finish_reason: 'stop',
        },
      ],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Bolo de cenoura',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 1/2 xícaras de farinha de trigo',
            modeOfPreparation: 'Misture tudo.',
          },
        ],
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);

    const params = createMock.mock.calls[0][0] as {
      response_format: { type: string };
      reasoning_effort: string;
      max_completion_tokens: number;
      messages: { content: string }[];
    };

    expect(params.response_format).toEqual({ type: 'json_object' });
    expect(params.reasoning_effort).toBe('low');
    expect(params.max_completion_tokens).toBe(8192);
    expect(params.messages[0].content).toContain('CONVERSÃO DE MEDIDAS');
    expect(params.messages[0].content).toContain('300 g');
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
      error: 'Erro ao processar com a IA. Tente novamente em instantes.',
    });
  });
});
