'use client';

import type { UseFormReturn } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import type { RecipeFormData } from '../../../schemas/recipe.schema';

type Props = {
  form: UseFormReturn<RecipeFormData>;
};

export function TitleField({ form }: Props) {
  const error = form.formState.errors.title?.message;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel
        htmlFor="recipe-title"
        className="text-base font-semibold text-neutral-800"
      >
        Título da receita
      </FieldLabel>

      <Input
        id="recipe-title"
        placeholder="Ex: Bolinho de chuva da vovó"
        className="h-12 rounded-2xl border-amber-100 bg-white/80 text-base focus-visible:ring-amber-400"
        aria-invalid={Boolean(error)}
        {...form.register('title')}
      />

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
