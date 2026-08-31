'use client';

import { Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { RecipeFormWithImages } from './ImageUploadField';

type Props = {
  form: UseFormReturn<RecipeFormWithImages>;
  index: number;
  isOnly: boolean;
  onRemove: () => void;
};

export function SectionField({ form, index, isOnly, onRemove }: Props) {
  const isFirst = index === 0;

  const nameError = form.formState.errors.sections?.[index]?.name?.message;
  const ingredientsError =
    form.formState.errors.sections?.[index]?.ingredientsText?.message;
  const modeError =
    form.formState.errors.sections?.[index]?.modeOfPreparation?.message;

  return (
    <section
      className="space-y-4 p-4 sm:p-5"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
        background: 'var(--muted)',
      }}
    >
      <div
        className="flex items-center justify-between gap-4 pb-3"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <h3
          className="text-xs font-bold uppercase"
          style={{ letterSpacing: '0.1em', color: 'var(--cocoa)' }}
        >
          {isFirst && isOnly ? 'Receita' : `Etapa ${index + 1}`}
        </h3>

        {!isOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-9 w-9 p-0 hover:bg-white"
            style={{ color: 'var(--ink-muted)' }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isFirst && (
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel
            htmlFor={`section-name-${index}`}
            className="text-sm font-semibold"
            style={{ color: 'var(--cocoa)' }}
          >
            Nome da etapa
          </FieldLabel>

          <Input
            id={`section-name-${index}`}
            placeholder="Ex: Massa, recheio, cobertura"
            className="bg-white"
            style={{ borderColor: 'var(--line)' }}
            aria-invalid={Boolean(nameError)}
            {...form.register(`sections.${index}.name`)}
          />

          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
      )}

      <Field data-invalid={Boolean(ingredientsError)}>
        <FieldLabel
          htmlFor={`section-ingredients-${index}`}
          className="text-sm font-semibold"
          style={{ color: 'var(--cocoa)' }}
        >
          Ingredientes
        </FieldLabel>

        <Textarea
          id={`section-ingredients-${index}`}
          placeholder={`2 ovos\n1 xícara de farinha\n1 colher de manteiga`}
          className="min-h-32 resize-none bg-white text-sm leading-relaxed"
          style={{ borderColor: 'var(--line)' }}
          aria-invalid={Boolean(ingredientsError)}
          {...form.register(`sections.${index}.ingredientsText`)}
        />

        {ingredientsError && <FieldError>{ingredientsError}</FieldError>}
      </Field>

      <Field data-invalid={Boolean(modeError)}>
        <FieldLabel
          htmlFor={`section-mode-${index}`}
          className="text-sm font-semibold"
          style={{ color: 'var(--cocoa)' }}
        >
          Modo de preparo
        </FieldLabel>

        <Textarea
          id={`section-mode-${index}`}
          placeholder="Descreva o passo a passo com clareza."
          className="min-h-48 resize-none bg-white text-sm leading-relaxed"
          style={{ borderColor: 'var(--line)' }}
          aria-invalid={Boolean(modeError)}
          {...form.register(`sections.${index}.modeOfPreparation`)}
        />

        {modeError && <FieldError>{modeError}</FieldError>}
      </Field>
    </section>
  );
}
