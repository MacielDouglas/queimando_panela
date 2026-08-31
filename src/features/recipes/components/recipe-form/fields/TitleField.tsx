'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { RecipeFormWithImages } from './ImageUploadField';

type Props = {
  form: UseFormReturn<RecipeFormWithImages>;
};

export function TitleField({ form }: Props) {
  const error = form.formState.errors.title?.message;

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel
        htmlFor="recipe-title"
        className="text-xs font-bold uppercase"
        style={{ letterSpacing: '0.1em', color: 'var(--cocoa)' }}
      >
        Título da receita
      </FieldLabel>

      <Input
        id="recipe-title"
        placeholder="Ex: Bolo de milho da minha avó"
        className="h-12 bg-white text-base"
        style={{ borderColor: 'var(--line)' }}
        aria-invalid={Boolean(error)}
        {...form.register('title')}
      />

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
