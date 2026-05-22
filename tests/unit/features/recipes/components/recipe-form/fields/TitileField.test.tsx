import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';

import { TitleField } from '@/features/recipes/components/recipe-form/fields/TitleField';

function TitleFieldHarness() {
  const form = useForm<any>({
    defaultValues: {
      title: '',
    },
  });

  return <TitleField form={form} />;
}

describe('TitleField', () => {
  it('renderiza input de título', () => {
    render(<TitleFieldHarness />);

    expect(screen.getByLabelText(/título da receita/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Ex: Bolo de milho da minha avó/i),
    ).toBeInTheDocument();
  });
});
