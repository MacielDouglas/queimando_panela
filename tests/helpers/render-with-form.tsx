import { render } from '@testing-library/react';
import { useForm, type DefaultValues } from 'react-hook-form';
import type { ReactElement } from 'react';

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
