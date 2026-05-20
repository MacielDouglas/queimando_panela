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
          className="text-base font-semibold text-neutral-800"
        >
          História da receita{' '}
          <span className="font-normal text-neutral-400">(opcional)</span>
        </FieldLabel>

        <span className="text-xs text-neutral-400">{value.length}/500</span>
      </div>

      <Textarea
        id="recipe-story"
        placeholder="Conta um pouco sobre essa receita... De onde veio? Qual a memória afetiva por trás dela?"
        className="min-h-28 resize-none rounded-2xl border-amber-100 bg-white/80 text-base focus-visible:ring-amber-400"
        maxLength={500}
        aria-invalid={Boolean(error)}
        {...form.register('story')}
      />

      <FieldDescription>
        Esse campo é opcional e ajuda a dar contexto afetivo à receita.
      </FieldDescription>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
