import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StoryField } from '@/features/recipes/components/recipe-form/fields/StoryField';
import { renderWithForm } from '../../../../../../helpers/render-with-form';

describe('StoryField', () => {
  it('renderiza textarea e contador', () => {
    renderWithForm((form) => <StoryField form={form as any} />, {
      title: '',
      story: 'Receita da família',
      sections: [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
      images: [],
    });

    expect(screen.getByLabelText(/história da receita/i)).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => element?.textContent === '18/500'),
    ).toBeInTheDocument();
  });
});
