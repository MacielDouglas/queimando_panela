'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type { RecipeFormWithImages } from './ImageUploadField';

type Props = {
  form: UseFormReturn<RecipeFormWithImages>;
};

export function StoryField({ form }: Props) {
  const value = form.watch('story') ?? '';
  const error = form.formState.errors.story?.message;

  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-4">
        <FieldLabel
          htmlFor="recipe-story"
          className="text-xs font-bold uppercase"
          style={{ letterSpacing: '0.1em', color: 'var(--cocoa)' }}
        >
          História da receita
        </FieldLabel>

        <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
          {value.length}/500
        </span>
      </div>

      <Textarea
        id="recipe-story"
        placeholder="Conte a memória, a origem ou o contexto dessa receita."
        className="min-h-32 resize-none bg-white text-base"
        style={{ borderColor: 'var(--line)' }}
        maxLength={500}
        aria-invalid={Boolean(error)}
        {...form.register('story')}
      />

      <FieldDescription style={{ color: 'var(--ink-muted)' }}>
        Esse campo é opcional e ajuda a contextualizar a receita.
      </FieldDescription>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
