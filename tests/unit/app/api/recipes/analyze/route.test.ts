// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const createMock = vi.fn();
const GroqMock = vi.fn().mockImplementation(function () {
  return {
    chat: {
      completions: {
        create: createMock,
      },
    },
  };
});

vi.mock('groq-sdk', () => ({
  default: GroqMock,
}));

describe('POST /api/recipes/analyze', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  it('retorna 400 sem título', async () => {
    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '',
        sections: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('retorna 500 sem GROQ_API_KEY', async () => {
    delete process.env.GROQ_API_KEY;

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    expect(response.status).toBe(500);
  });

  it('retorna dados parseados quando Groq responde com JSON válido', async () => {
    createMock.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'Receita',
              summary: 'Resumo',
              difficulty: 'EASY',
              difficultyLabel: 'Fácil',
              type: 'Doce',
              prepTimeMinutes: 10,
              cookTimeMinutes: 20,
              suggestions: 'Troca ingrediente',
              nutritionSummary: 'Resumo nutri',
              nutritionPer100g: [
                { nutrient: 'Calorias', quantity: '100 kcal' },
              ],
              utensils: ['Tigela'],
              sections: [
                {
                  name: 'Receita',
                  ingredients: ['2 ovos'],
                  modeOfPreparation: '1. Misture.',
                },
              ],
            }),
          },
        },
      ],
    });

    const { POST } = await import('@/app/api/recipes/analyze/route');

    const request = new Request('http://localhost/api/recipes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.title).toBe('Receita');
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(GroqMock).toHaveBeenCalledTimes(1);
  });
});
