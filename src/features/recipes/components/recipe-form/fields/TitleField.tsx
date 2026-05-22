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
        className="text-sm font-bold tracking-[0.16em] text-neutral-900 uppercase"
      >
        Título da receita
      </FieldLabel>

      <Input
        id="recipe-title"
        placeholder="Ex: Bolo de milho da minha avó"
        className="h-12 border-neutral-300 bg-white text-base focus-visible:ring-amber-500"
        aria-invalid={Boolean(error)}
        {...form.register('title')}
      />

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
