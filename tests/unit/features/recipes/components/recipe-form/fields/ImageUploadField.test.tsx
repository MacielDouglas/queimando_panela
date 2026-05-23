import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageUploadField } from '@/features/recipes/components/recipe-form/fields/ImageUploadField';
import type { RecipeImageInput } from '@/features/recipes/types/recipe-form-images.types';

const useDropzoneMock = vi.fn();

vi.mock('react-dropzone', () => ({
  useDropzone: (...args: unknown[]) => useDropzoneMock(...args),
}));

vi.mock('next/image', () => ({
  default: ({
    alt,
    src,
    ...props
  }: {
    alt: string;
    src: string;
    [key: string]: unknown;
  }) => (
    <span
      data-testid="mock-next-image"
      data-alt={alt}
      data-src={src}
      {...props}
    />
  ),
}));

function createFormMock(initialImages?: RecipeImageInput[]) {
  let images = initialImages ?? [];

  return {
    watch: vi.fn((name: string) => (name === 'images' ? images : undefined)),
    getValues: vi.fn((name: string) =>
      name === 'images' ? images : undefined,
    ),
    setValue: vi.fn((name: string, value: RecipeImageInput[]) => {
      if (name === 'images') images = value;
    }),
  };
}

describe('ImageUploadField', () => {
  const createObjectURLMock = vi.fn();
  const revokeObjectURLMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal('URL', {
      createObjectURL: createObjectURLMock.mockImplementation(
        (file: File) => `blob:${file.name}`,
      ),
      revokeObjectURL: revokeObjectURLMock,
    });

    useDropzoneMock.mockImplementation(
      ({ disabled }: { disabled: boolean }) => ({
        getRootProps: () => ({
          'data-testid': 'dropzone',
          'data-disabled': String(disabled),
        }),
        getInputProps: () => ({
          'data-testid': 'dropzone-input',
        }),
        isDragActive: false,
      }),
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('renderiza estado inicial com área de upload', () => {
    const form = createFormMock();

    render(<ImageUploadField form={form as any} />);

    expect(screen.getByText(/Fotos da receita/i)).toBeInTheDocument();
    expect(screen.getByText(/Adicionar foto/i)).toBeInTheDocument();
    expect(screen.queryByText(/Capa/i)).not.toBeInTheDocument();
  });

  it('renderiza imagens existentes e marca a primeira como capa', () => {
    const form = createFormMock([
      {
        kind: 'existing',
        id: 'img-1',
        url: 'https://cdn.test/1.webp',
        isCover: true,
        order: 0,
      },
      {
        kind: 'existing',
        id: 'img-2',
        url: 'https://cdn.test/2.webp',
        isCover: false,
        order: 1,
      },
    ] as RecipeImageInput[]);

    render(<ImageUploadField form={form as any} />);

    expect(screen.getAllByTestId('mock-next-image')).toHaveLength(2);
    expect(screen.getByText('Capa')).toBeInTheDocument();
    expect(screen.getByText(/Adicionar foto/i)).toBeInTheDocument();
  });

  it('desabilita a área de upload quando já existem 3 imagens', () => {
    const form = createFormMock([
      { kind: 'existing', id: '1', url: '/1.jpg', isCover: true, order: 0 },
      { kind: 'existing', id: '2', url: '/2.jpg', isCover: false, order: 1 },
      { kind: 'existing', id: '3', url: '/3.jpg', isCover: false, order: 2 },
    ] as RecipeImageInput[]);

    render(<ImageUploadField form={form as any} />);

    expect(screen.queryByText(/Adicionar foto/i)).not.toBeInTheDocument();
  });

  it('remove imagem nova e revoga object URL', async () => {
    const user = userEvent.setup();

    const form = createFormMock([
      {
        kind: 'new',
        file: new File(['a'], 'foto.png', { type: 'image/png' }),
        previewUrl: 'blob:foto.png',
        isCover: true,
        order: 0,
      },
    ] as RecipeImageInput[]);

    render(<ImageUploadField form={form as any} />);

    await user.click(screen.getByRole('button'));

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:foto.png');
    expect(form.setValue).toHaveBeenCalledWith(
      'images',
      [],
      expect.objectContaining({
        shouldValidate: true,
        shouldDirty: true,
      }),
    );
  });

  it('substitui imagem existente por nova imagem', () => {
    const form = createFormMock([
      {
        kind: 'existing',
        id: 'img-1',
        url: 'https://cdn.test/1.webp',
        isCover: true,
        order: 0,
      },
    ] as RecipeImageInput[]);

    render(<ImageUploadField form={form as any} />);

    const fileInput = screen.getByLabelText('', {
      selector: 'input[type="file"]',
    });
    const file = new File(['abc'], 'nova.png', { type: 'image/png' });

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(createObjectURLMock).toHaveBeenCalledWith(file);
    expect(form.setValue).toHaveBeenCalledWith(
      'images',
      [
        {
          kind: 'new',
          file,
          previewUrl: 'blob:nova.png',
          isCover: true,
          order: 0,
        },
      ],
      expect.objectContaining({
        shouldValidate: true,
        shouldDirty: true,
      }),
    );
  });

  it('revoga URLs das imagens novas ao desmontar', () => {
    const form = createFormMock([
      {
        kind: 'new',
        file: new File(['a'], 'a.png', { type: 'image/png' }),
        previewUrl: 'blob:a.png',
        isCover: true,
        order: 0,
      },
      {
        kind: 'existing',
        id: 'img-2',
        url: 'https://cdn.test/2.webp',
        isCover: false,
        order: 1,
      },
    ] as RecipeImageInput[]);

    const { unmount } = render(<ImageUploadField form={form as any} />);

    unmount();

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:a.png');
  });
});
