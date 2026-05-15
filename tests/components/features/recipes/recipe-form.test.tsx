vi.mock('@/features/recipes/components/spell-check-modal', () => ({
  SpellCheckModal: ({ onApply, onClose }: { onApply: () => void; onClose: () => void }) => (
    <div>
      <p>SpellCheckModal</p>

      <button type="button" onClick={onApply}>
        Aplicar correções
      </button>

      <button type="button" onClick={onClose}>
        Fechar modal
      </button>
    </div>
  ),
}));

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const generateMock = vi.fn();
const checkMock = vi.fn();
const clearMock = vi.fn();

let mockedActionState: { status: string; message: string | null } = {
  status: 'idle',
  message: null,
};

let recipeGeneratorState = {
  isGenerating: false,
  error: null as string | null,
  generate: generateMock,
};

let spellCheckState = {
  isChecking: false,
  error: null as string | null,
  diffs: null as unknown,
  check: checkMock,
  clear: clearMock,
};

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useActionState: vi.fn(() => [mockedActionState, vi.fn()]),
  };
});

vi.mock('@/features/recipes/actions/create-recipe', () => ({
  createRecipeAction: vi.fn(),
}));

vi.mock('@/features/recipes/actions/update-recipe', () => ({
  updateRecipeAction: vi.fn(),
}));

vi.mock('@/features/recipes/hooks/use-recipe-generator', () => ({
  useRecipeGenerator: () => recipeGeneratorState,
}));

vi.mock('@/features/recipes/hooks/use-spell-check', () => ({
  useSpellCheck: () => spellCheckState,
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

vi.mock('@/features/recipes/components/submit-button', () => ({
  SubmitButton: ({ label }: { label: string }) => <button type="submit">{label}</button>,
}));

import { RecipeForm } from '@/features/recipes/components/recipe-form';

describe('RecipeForm - branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedActionState = {
      status: 'idle',
      message: null,
    };

    recipeGeneratorState = {
      isGenerating: false,
      error: null,
      generate: generateMock,
    };

    spellCheckState = {
      isChecking: false,
      error: null,
      diffs: null,
      check: checkMock,
      clear: clearMock,
    };

    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => 'blob:nova-imagem'),
      revokeObjectURL: vi.fn(),
    });
  });

  it('renderiza erro da action', () => {
    mockedActionState = {
      status: 'error',
      message: 'Falha ao salvar receita',
    };

    render(<RecipeForm />);

    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao salvar receita');
  });

  it('renderiza erro de geração', () => {
    recipeGeneratorState = {
      ...recipeGeneratorState,
      error: 'Erro ao gerar com IA',
    };

    render(<RecipeForm />);

    expect(screen.getByText('Erro ao gerar com IA')).toBeInTheDocument();
  });

  it('renderiza erro de spell check', () => {
    spellCheckState = {
      ...spellCheckState,
      error: 'Erro ao revisar texto',
    };

    render(<RecipeForm />);

    expect(screen.getByText('Erro ao revisar texto')).toBeInTheDocument();
  });

  it('renderiza modal quando existem diffs', () => {
    spellCheckState = {
      ...spellCheckState,
      diffs: [{ field: 'title', original: 'Bloo', corrected: 'Bolo' }],
    };

    render(<RecipeForm />);

    expect(screen.getByText('SpellCheckModal')).toBeInTheDocument();
  });

  it('fecha modal chamando clear', async () => {
    const user = userEvent.setup();

    spellCheckState = {
      ...spellCheckState,
      diffs: [{ field: 'title', original: 'Bloo', corrected: 'Bolo' }],
    };

    render(<RecipeForm />);

    await user.click(screen.getByRole('button', { name: /fechar modal/i }));

    expect(clearMock).toHaveBeenCalledTimes(1);
  });

  it('aplica correções retornadas pelo spell check', async () => {
    const user = userEvent.setup();

    spellCheckState = {
      ...spellCheckState,
      diffs: [{ field: 'title', original: 'Bloo', corrected: 'Bolo' }],
    };

    render(<RecipeForm />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Bloo de milho' },
    });

    await user.click(screen.getByRole('button', { name: /aplicar correções/i }));
  });

  it('mostra alerta para tipo de imagem inválido', () => {
    render(<RecipeForm />);

    const input = screen.getByLabelText(/enviar imagem/i);
    const file = new File(['abc'], 'arquivo.gif', { type: 'image/gif' });

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(window.alert).toHaveBeenCalledWith('Envie PNG, JPG ou WebP.');
    expect(screen.queryByText(/nova imagem selecionada/i)).not.toBeInTheDocument();
  });

  it('mostra alerta para imagem maior que 5mb', () => {
    render(<RecipeForm />);

    const input = screen.getByLabelText(/enviar imagem/i);
    const file = new File(['abc'], 'arquivo.png', { type: 'image/png' });

    Object.defineProperty(file, 'size', {
      value: 6 * 1024 * 1024,
    });

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(window.alert).toHaveBeenCalledWith('A imagem deve ter no máximo 5 MB.');
    expect(screen.queryByText(/nova imagem selecionada/i)).not.toBeInTheDocument();
  });

  it('em modo edit mostra capa atual e permite marcar remoção', async () => {
    const user = userEvent.setup();

    render(
      <RecipeForm
        mode="edit"
        initialData={{
          id: 'recipe-1',
          title: 'Bolo de milho',
          summary: null,
          story: null,
          modeOfPreparation: 'Misture tudo',
          difficulty: 'MEDIUM',
          type: 'Sobremesa',
          prepTimeMinutes: 10,
          cookTimeMinutes: 40,
          servings: 8,
          suggestions: null,
          notesAuthor: null,
          notesPublic: null,
          ingredients: [],
          utensils: [],
          images: [
            {
              id: 'img-1',
              key: 'recipes/1/cover.webp',
              url: 'https://example.com/cover.webp',
              alt: 'Capa atual',
              contentType: 'image/webp',
              sizeBytes: 1234,
              width: 1200,
              height: 800,
              order: 0,
              isCover: true,
              recipeId: 'recipe-1',
            },
          ],
        }}
      />,
    );

    expect(screen.getByAltText('Capa atual')).toBeInTheDocument();

    const checkbox = screen.getByLabelText(/remover imagem atual/i);
    await user.click(checkbox);

    const hiddenInput = document.querySelector(
      'input[name="removeCoverImage"]',
    ) as HTMLInputElement;

    expect(hiddenInput.value).toBe('true');
  });

  it('seleciona imagem válida e mostra preview', () => {
    render(
      <RecipeForm
        mode="edit"
        initialData={{
          id: 'recipe-1',
          title: 'Bolo de milho',
          summary: null,
          story: null,
          modeOfPreparation: 'Misture tudo',
          difficulty: 'MEDIUM',
          type: 'Sobremesa',
          prepTimeMinutes: 10,
          cookTimeMinutes: 40,
          servings: 8,
          suggestions: null,
          notesAuthor: null,
          notesPublic: null,
          ingredients: [],
          utensils: [],
          images: [
            {
              id: 'img-1',
              key: 'recipes/1/cover.webp',
              url: 'https://example.com/cover.webp',
              alt: 'Capa atual',
              contentType: 'image/webp',
              sizeBytes: 1234,
              width: 1200,
              height: 800,
              order: 0,
              isCover: true,
              recipeId: 'recipe-1',
            },
          ],
        }}
      />,
    );

    const input = screen.getByLabelText(/trocar imagem/i);
    const file = new File(['abc'], 'arquivo.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByText(/nova imagem selecionada/i)).toBeInTheDocument();
    expect(screen.getByAltText(/pré-visualização da nova imagem/i)).toBeInTheDocument();
  });
});
