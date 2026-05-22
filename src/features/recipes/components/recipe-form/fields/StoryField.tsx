'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { RecipeFormData } from '../../../schemas/recipe.schema';

type Props = {
  form: UseFormReturn<RecipeFormData>;
};

export function StoryField({ form }: Props) {
  const value = form.watch('story') ?? '';
  const error = form.formState.errors.story?.message;

  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel
          htmlFor="recipe-story"
          className="text-sm font-bold tracking-[0.16em] text-neutral-900 uppercase"
        >
          História da receita
        </FieldLabel>

        <span className="text-xs text-neutral-500">{value.length}/500</span>
      </div>

      <Textarea
        id="recipe-story"
        placeholder="Conte a memória, a origem ou o contexto dessa receita."
        className="min-h-32 resize-none border-neutral-300 bg-white text-base focus-visible:ring-amber-500"
        maxLength={500}
        aria-invalid={Boolean(error)}
        {...form.register('story')}
      />

      <FieldDescription>
        Esse campo é opcional e ajuda a contextualizar a receita.
      </FieldDescription>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
