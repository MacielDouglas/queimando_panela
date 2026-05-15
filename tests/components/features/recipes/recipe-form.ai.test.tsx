import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecipeForm } from '@/features/recipes/components/recipe-form';

const generateMock = vi.fn();
const checkMock = vi.fn();
const clearMock = vi.fn();

vi.mock('@/features/recipes/actions/create-recipe', () => ({
  createRecipeAction: vi.fn(),
}));

vi.mock('@/features/recipes/actions/update-recipe', () => ({
  updateRecipeAction: vi.fn(),
}));

vi.mock('@/features/recipes/hooks/use-recipe-generator', () => ({
  useRecipeGenerator: () => ({
    isGenerating: false,
    error: null,
    generate: generateMock,
  }),
}));

vi.mock('@/features/recipes/hooks/use-spell-check', () => ({
  useSpellCheck: () => ({
    isChecking: false,
    error: null,
    diffs: null,
    check: checkMock,
    clear: clearMock,
  }),
}));

vi.mock('@/features/recipes/components/ingredients-editor', () => ({
  IngredientsEditor: () => <div>IngredientsEditor</div>,
}));

vi.mock('@/features/recipes/components/utensils-editor', () => ({
  UtensilsEditor: () => <div>UtensilsEditor</div>,
}));

vi.mock('@/features/recipes/components/ai-classification', () => ({
  AiClassification: () => <div>AiClassification</div>,
}));

vi.mock('@/features/recipes/components/NutritionTable', () => ({
  NutritionTable: ({ summary }: { summary: string }) => <div>NutritionTable {summary}</div>,
}));

vi.mock('@/features/recipes/components/type-selector', () => ({
  TypeSelector: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <input aria-label="Tipo" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

vi.mock('@/features/recipes/components/spell-check-modal', () => ({
  SpellCheckModal: () => <div>SpellCheckModal</div>,
}));

vi.mock('@/features/recipes/components/submit-button', () => ({
  SubmitButton: ({ label }: { label: string }) => <button type="submit">{label}</button>,
}));

describe('RecipeForm - IA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('foca no título quando tentar gerar com IA sem título', async () => {
    const user = userEvent.setup();

    render(<RecipeForm />);

    const button = screen.getByRole('button', { name: /gerar com ia/i });
    const titleInput = screen.getByLabelText(/título/i);

    await user.click(button);

    expect(generateMock).not.toHaveBeenCalled();
    expect(titleInput).toHaveFocus();
  });

  it('não chama generate quando modo de preparo está vazio', async () => {
    const user = userEvent.setup();

    render(<RecipeForm />);

    await user.type(screen.getByLabelText(/título/i), 'Bolo de milho');
    await user.click(screen.getByRole('button', { name: /gerar com ia/i }));

    expect(generateMock).not.toHaveBeenCalled();
  });

  it('preenche campos derivados quando a IA retorna dados', async () => {
    const user = userEvent.setup();

    generateMock.mockResolvedValue({
      modeOfPreparation: 'Misture e asse.',
      summary: 'Bolo fofo e caseiro.',
      ingredients: [{ id: '1', name: 'Fubá', quantity: '2 xícaras' }],
      utensils: [{ name: 'Tigela' }],
      classification: {
        category: 'bolo',
        tags: ['caseiro'],
        typeSuggestions: ['Sobremesa'],
      },
      difficulty: 'EASY',
      cookTimeMinutes: 40,
      suggestions: 'Sirva com café.',
      nutritionTable: [{ nutrient: 'Calorias', amount: '100 kcal' }],
      nutritionSummary: '100 kcal por porção',
    });

    render(<RecipeForm />);

    await user.type(screen.getByLabelText(/título/i), 'Bolo de milho');
    await user.type(
      screen.getByLabelText(/modo de preparo/i),
      'Misture os ingredientes e leve ao forno.',
    );

    await user.click(screen.getByRole('button', { name: /gerar com ia/i }));

    expect(generateMock).toHaveBeenCalledWith({
      title: 'Bolo de milho',
      modeOfPreparation: 'Misture os ingredientes e leve ao forno.',
    });

    expect(screen.getByDisplayValue('Bolo fofo e caseiro.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('40')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sirva com café.')).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toHaveValue('Sobremesa');
    expect(screen.getByText(/NutritionTable 100 kcal por porção/i)).toBeInTheDocument();
  });
});
