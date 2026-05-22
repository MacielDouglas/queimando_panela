'use client';

import { Trash2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { RecipeFormData } from '../../../schemas/recipe.schema';

type Props = {
  form: UseFormReturn<RecipeFormData>;
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
    <section className="space-y-4 border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
        <h3 className="text-sm font-bold tracking-[0.16em] text-neutral-900 uppercase">
          {isFirst && isOnly ? 'Receita' : `Etapa ${index + 1}`}
        </h3>

        {!isOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-9 w-9 p-0 text-neutral-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isFirst && (
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel
            htmlFor={`section-name-${index}`}
            className="text-sm font-semibold text-neutral-800"
          >
            Nome da etapa
          </FieldLabel>

          <Input
            id={`section-name-${index}`}
            placeholder="Ex: Massa, recheio, cobertura"
            className="border-neutral-300 bg-white focus-visible:ring-amber-500"
            aria-invalid={Boolean(nameError)}
            {...form.register(`sections.${index}.name`)}
          />

          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
      )}

      <Field data-invalid={Boolean(ingredientsError)}>
        <FieldLabel
          htmlFor={`section-ingredients-${index}`}
          className="text-sm font-semibold text-neutral-800"
        >
          Ingredientes
        </FieldLabel>

        <Textarea
          id={`section-ingredients-${index}`}
          placeholder={`2 ovos\n1 xícara de farinha\n1 colher de manteiga`}
          className="min-h-32 resize-none border-neutral-300 bg-white text-sm leading-relaxed focus-visible:ring-amber-500"
          aria-invalid={Boolean(ingredientsError)}
          {...form.register(`sections.${index}.ingredientsText`)}
        />

        {ingredientsError && <FieldError>{ingredientsError}</FieldError>}
      </Field>

      <Field data-invalid={Boolean(modeError)}>
        <FieldLabel
          htmlFor={`section-mode-${index}`}
          className="text-sm font-semibold text-neutral-800"
        >
          Modo de preparo
        </FieldLabel>

        <Textarea
          id={`section-mode-${index}`}
          placeholder="Descreva o passo a passo com clareza."
          className="min-h-48 resize-none border-neutral-300 bg-white text-sm leading-relaxed focus-visible:ring-amber-500"
          aria-invalid={Boolean(modeError)}
          {...form.register(`sections.${index}.modeOfPreparation`)}
        />

        {modeError && <FieldError>{modeError}</FieldError>}
      </Field>
    </section>
  );
}
