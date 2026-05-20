import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TitleField } from '@/features/recipes/components/recipe-form/fields/TitleField';
import { renderWithForm } from '../../../../../../helpers/render-with-form';

describe('TitleField', () => {
  it('renderiza input de título', () => {
    renderWithForm((form) => <TitleField form={form as any} />, {
      title: '',
      story: '',
      sections: [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
      images: [],
    });

    expect(screen.getByLabelText(/título da receita/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/bolinho de chuva/i),
    ).toBeInTheDocument();
  });
});
