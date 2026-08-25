import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { type DefaultValues, useForm } from 'react-hook-form';

export function renderWithForm<TFieldValues extends Record<string, any>>(
  ui: (form: ReturnType<typeof useForm<TFieldValues>>) => ReactElement,
  defaultValues: DefaultValues<TFieldValues>,
) {
  function Wrapper() {
    const form = useForm<TFieldValues>({ defaultValues });
    return ui(form);
  }

  return render(<Wrapper />);
}
