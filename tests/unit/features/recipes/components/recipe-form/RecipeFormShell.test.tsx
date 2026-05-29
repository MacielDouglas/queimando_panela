import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipeFormShell } from '@/features/recipes/components/recipe-form/RecipeFormShell';

const createRecipeMock = vi.fn();
const updateRecipeMock = vi.fn();

vi.mock('@/features/recipes/actions/create-recipe', () => ({
  createRecipe: (...args: unknown[]) => createRecipeMock(...args),
}));

vi.mock('@/features/recipes/actions/update-recipe', () => ({
  updateRecipe: (...args: unknown[]) => updateRecipeMock(...args),
}));

function readRecipeFormData(formData: FormData) {
  return {
    analysis: JSON.parse(String(formData.get('analysis') ?? '{}')),
    story: String(formData.get('story') ?? ''),
    existingImages: JSON.parse(String(formData.get('existingImages') ?? '[]')),
  };
}

describe('RecipeFormShell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renderiza a estrutura básica no modo create', () => {
    render(<RecipeFormShell mode="create" />);

    expect(screen.getByLabelText(/Título da receita/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/História da receita/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Adicionar etapa/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Revisão final/i)).not.toBeInTheDocument();
  });

  it('analisa receita válida, envia payload correto e renderiza painel de revisão', async () => {
    const user = userEvent.setup();

    const fetchMock = vi.mocked(global.fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          title: 'Bolo de milho',
          summary: 'Fofo e cremoso',
          difficulty: 'EASY',
          difficultyLabel: 'Fácil',
          types: ['Bolo'],
          prepTimeMinutes: 15,
          cookTimeMinutes: 45,
          suggestions: 'Troque leite integral por desnatado.',
          nutritionSummary: 'Resumo nutricional',
          nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
          utensils: ['Forma'],
          sections: [
            {
              name: 'Receita',
              ingredients: ['2 xícaras de milho', '1 xícara de leite'],
              modeOfPreparation: 'Misture tudo e asse.',
            },
          ],
        },
      }),
    } as Response);

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo de milho',
    );
    await user.type(
      screen.getByLabelText(/Ingredientes/i),
      '2 xícaras de milho',
    );
    await user.type(
      screen.getByLabelText(/Modo de preparo/i),
      'Misture tudo e asse.',
    );

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    expect(fetchMock).toHaveBeenCalledWith('/api/recipes/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Bolo de milho',
        sections: [
          {
            name: 'Receita',
            ingredientsText: '2 xícaras de milho',
            modeOfPreparation: 'Misture tudo e asse.',
          },
        ],
      }),
    });

    expect(
      await screen.findByRole('heading', { name: /Revisão final/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: /título da receita/i,
      }),
    ).toHaveValue('Bolo de milho');
    expect(screen.getByDisplayValue('Fofo e cremoso')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bolo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Resumo nutricional')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Salvar receita/i }),
    ).toBeInTheDocument();
  });

  it('normaliza o nome da etapa para "Receita" quando o nome vem vazio na primeira seção', async () => {
    const user = userEvent.setup();

    const fetchMock = vi.mocked(global.fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: undefined }),
    } as Response);

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo simples',
    );
    await user.type(screen.getByLabelText(/Ingredientes/i), 'Farinha');
    await user.type(screen.getByLabelText(/Modo de preparo/i), 'Misture');

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recipes/analyze',
      expect.objectContaining({
        body: JSON.stringify({
          title: 'Bolo simples',
          sections: [
            {
              name: 'Receita',
              ingredientsText: 'Farinha',
              modeOfPreparation: 'Misture',
            },
          ],
        }),
      }),
    );
  });

  it('mostra erro quando a análise falha com erro da API', async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({
        error: 'Falha ao analisar receita com IA.',
      }),
    } as Response);

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo de milho',
    );
    await user.type(screen.getByLabelText(/Ingredientes/i), 'Milho');
    await user.type(screen.getByLabelText(/Modo de preparo/i), 'Misture tudo.');

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    expect(
      await screen.findByText(/Falha ao analisar receita com IA/i),
    ).toBeInTheDocument();
  });

  it('mostra erro amigável quando o fetch lança exceção', async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockRejectedValue(new Error('network error'));

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo de milho',
    );
    await user.type(screen.getByLabelText(/Ingredientes/i), 'Milho');
    await user.type(screen.getByLabelText(/Modo de preparo/i), 'Misture tudo.');

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    expect(
      await screen.findByText(/Não foi possível analisar a receita agora/i),
    ).toBeInTheDocument();
  });

  it('salva a receita no modo create após revisão', async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          title: 'Bolo de milho',
          summary: 'Fofo e cremoso',
          difficulty: 'EASY',
          difficultyLabel: 'Fácil',
          types: ['Bolo'],
          prepTimeMinutes: 15,
          cookTimeMinutes: 45,
          suggestions: 'Troque leite integral por desnatado.',
          nutritionSummary: 'Resumo nutricional',
          nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
          utensils: ['Forma'],
          sections: [
            {
              name: 'Receita',
              ingredients: ['2 xícaras de milho'],
              modeOfPreparation: 'Misture tudo e asse.',
            },
          ],
        },
      }),
    } as Response);

    createRecipeMock.mockResolvedValue(undefined);

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo de milho',
    );
    await user.type(
      screen.getByLabelText(/História da receita/i),
      'Receita da família',
    );
    await user.type(
      screen.getByLabelText(/Ingredientes/i),
      '2 xícaras de milho',
    );
    await user.type(
      screen.getByLabelText(/Modo de preparo/i),
      'Misture tudo e asse.',
    );

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    await screen.findByRole('heading', { name: /Revisão final/i });

    await user.click(screen.getByRole('button', { name: /Salvar receita/i }));

    expect(createRecipeMock).toHaveBeenCalledTimes(1);

    const formData = createRecipeMock.mock.calls[0][0] as FormData;
    expect(formData).toBeInstanceOf(FormData);

    const payload = readRecipeFormData(formData);

    expect(payload.story).toBe('Receita da família');
    expect(payload.existingImages).toEqual([]);
    expect(payload.analysis).toMatchObject({
      title: 'Bolo de milho',
      summary: 'Fofo e cremoso',
      difficulty: 'EASY',
      difficultyLabel: 'Fácil',
      types: ['Bolo'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 45,
      suggestions: 'Troque leite integral por desnatado.',
      nutritionSummary: 'Resumo nutricional',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: ['Forma'],
      sections: [
        {
          name: 'Receita',
          ingredients: ['2 xícaras de milho'],
          modeOfPreparation: 'Misture tudo e asse.',
        },
      ],
    });
  });

  it('mostra erro quando o salvamento no modo create falha', async () => {
    const user = userEvent.setup();

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          title: 'Bolo de milho',
          summary: 'Fofo e cremoso',
          difficulty: 'EASY',
          difficultyLabel: 'Fácil',
          types: ['Bolo'],
          prepTimeMinutes: 15,
          cookTimeMinutes: 45,
          suggestions: 'Troque leite integral por desnatado.',
          nutritionSummary: 'Resumo nutricional',
          nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
          utensils: ['Forma'],
          sections: [
            {
              name: 'Receita',
              ingredients: ['2 xícaras de milho'],
              modeOfPreparation: 'Misture tudo e asse.',
            },
          ],
        },
      }),
    } as Response);

    createRecipeMock.mockResolvedValue({
      error: 'Não foi possível salvar a receita.',
    });

    render(<RecipeFormShell mode="create" />);

    await user.type(
      screen.getByLabelText(/Título da receita/i),
      'Bolo de milho',
    );
    await user.type(
      screen.getByLabelText(/Ingredientes/i),
      '2 xícaras de milho',
    );
    await user.type(
      screen.getByLabelText(/Modo de preparo/i),
      'Misture tudo e asse.',
    );

    await user.click(
      screen.getByRole('button', { name: /Analisar receita com IA/i }),
    );

    await screen.findByRole('heading', { name: /Revisão final/i });

    await user.click(screen.getByRole('button', { name: /Salvar receita/i }));

    expect(
      await screen.findByText(/Não foi possível salvar a receita/i),
    ).toBeInTheDocument();
  });

  it('renderiza revisão inicial no modo edit e salva alterações', async () => {
    const user = userEvent.setup();

    updateRecipeMock.mockResolvedValue(undefined);

    render(
      <RecipeFormShell
        mode="edit"
        initialData={{
          id: 'recipe-1',
          slug: 'bolo-de-milho',
          title: 'Bolo de milho',
          story: 'Receita da família',
          summary: 'Fofo e cremoso',
          difficulty: 'EASY',
          difficultyLabel: 'Fácil',
          types: ['Bolo'],
          prepTimeMinutes: 15,
          cookTimeMinutes: 45,
          suggestions: 'Use menos açúcar',
          nutritionSummary: 'Resumo nutricional',
          nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
          utensils: ['Forma'],
          sections: [
            {
              name: 'Receita',
              ingredients: [
                {
                  originalText: '2 xícaras de milho',
                  name: 'milho',
                  generalName: 'milho',
                },
              ],
              modeOfPreparation: 'Misture tudo e asse.',
            },
          ],
          images: [],
        }}
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: /título da receita/i,
      }),
    ).toHaveValue('Bolo de milho');
    expect(screen.getByDisplayValue('Receita da família')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Revisão final/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Salvar alterações/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Reanalisar receita com IA/i }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Salvar alterações/i }),
    );

    expect(updateRecipeMock).toHaveBeenCalledTimes(1);
    expect(updateRecipeMock.mock.calls[0][0]).toBe('bolo-de-milho');

    const formData = updateRecipeMock.mock.calls[0][1] as FormData;
    expect(formData).toBeInstanceOf(FormData);

    const payload = readRecipeFormData(formData);

    expect(payload.story).toBe('Receita da família');
    expect(payload.existingImages).toEqual([]);
    expect(payload.analysis).toMatchObject({
      title: 'Bolo de milho',
      summary: 'Fofo e cremoso',
      difficulty: 'EASY',
      difficultyLabel: 'Fácil',
      types: ['Bolo'],
      prepTimeMinutes: 15,
      cookTimeMinutes: 45,
      suggestions: 'Use menos açúcar',
      nutritionSummary: 'Resumo nutricional',
      nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
      utensils: ['Forma'],
      sections: [
        {
          name: 'Receita',
          ingredients: ['2 xícaras de milho'],
          modeOfPreparation: 'Misture tudo e asse.',
        },
      ],
    });
  });
});
