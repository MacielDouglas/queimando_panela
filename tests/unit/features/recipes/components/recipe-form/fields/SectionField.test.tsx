import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SectionField } from '@/features/recipes/components/recipe-form/fields/SectionField';
import { renderWithForm } from '../../../../../../helpers/render-with-form';

describe('SectionField', () => {
  it('renderiza campos principais da etapa única', () => {
    renderWithForm(
      (form) => (
        <SectionField form={form as any} index={0} isOnly onRemove={vi.fn()} />
      ),
      {
        title: '',
        story: '',
        sections: [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
        images: [],
      },
    );

    expect(screen.getByText('Receita')).toBeInTheDocument();
    expect(screen.getByLabelText(/ingredientes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modo de preparo/i)).toBeInTheDocument();
  });

  it('permite remover etapa quando não é única', () => {
    const onRemove = vi.fn();

    renderWithForm(
      (form) => (
        <SectionField
          form={form as any}
          index={1}
          isOnly={false}
          onRemove={onRemove}
        />
      ),
      {
        title: '',
        story: '',
        sections: [
          { name: 'Receita', ingredientsText: '', modeOfPreparation: '' },
          { name: 'Cobertura', ingredientsText: '', modeOfPreparation: '' },
        ],
        images: [],
      },
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
