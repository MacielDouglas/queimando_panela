import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RecipeImageInput } from '@/features/recipes/components/recipe-image-input';

describe('RecipeImageInput', () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: createObjectURL,
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: revokeObjectURL,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('mostra placeholder quando não há imagem', () => {
    render(<RecipeImageInput />);

    expect(screen.getByText(/nenhuma imagem selecionada/i)).toBeInTheDocument();
  });

  it('mostra imagem padrão quando defaultImageUrl é fornecida', () => {
    render(<RecipeImageInput defaultImageUrl="https://example.com/cover.webp" />);

    expect(screen.getByAltText(/pré-visualização da imagem da receita/i)).toHaveAttribute(
      'src',
      'https://example.com/cover.webp',
    );
  });

  it('gera preview ao selecionar um arquivo', () => {
    createObjectURL.mockReturnValue('blob:file-1');

    render(<RecipeImageInput />);

    const input = screen.getByLabelText(/imagem da receita/i);
    const file = new File(['img'], 'foto.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByAltText(/pré-visualização da imagem da receita/i)).toHaveAttribute(
      'src',
      'blob:file-1',
    );
  });

  it('volta para a imagem padrão quando nenhum arquivo é selecionado', () => {
    render(<RecipeImageInput defaultImageUrl="https://example.com/default.webp" />);

    const input = screen.getByLabelText(/imagem da receita/i);

    fireEvent.change(input, { target: { files: [] } });

    expect(screen.getByAltText(/pré-visualização da imagem da receita/i)).toHaveAttribute(
      'src',
      'https://example.com/default.webp',
    );
  });

  it('revoga blob anterior ao selecionar um novo arquivo', () => {
    createObjectURL.mockReturnValueOnce('blob:file-1').mockReturnValueOnce('blob:file-2');

    render(<RecipeImageInput />);

    const input = screen.getByLabelText(/imagem da receita/i);
    const file1 = new File(['img1'], 'foto1.png', { type: 'image/png' });
    const file2 = new File(['img2'], 'foto2.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file1] } });
    fireEvent.change(input, { target: { files: [file2] } });

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:file-1');
    expect(screen.getByAltText(/pré-visualização da imagem da receita/i)).toHaveAttribute(
      'src',
      'blob:file-2',
    );
  });

  it('revoga blob no unmount', () => {
    createObjectURL.mockReturnValue('blob:file-1');

    const { unmount } = render(<RecipeImageInput />);

    const input = screen.getByLabelText(/imagem da receita/i);
    const file = new File(['img'], 'foto.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    unmount();

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:file-1');
  });
});
