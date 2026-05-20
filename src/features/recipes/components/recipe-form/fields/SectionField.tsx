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
    <div className="space-y-4 rounded-3xl border border-amber-100 bg-white/70 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-neutral-800">
          {isFirst && isOnly ? 'Receita' : `Etapa ${index + 1}`}
        </h3>

        {!isOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 rounded-full p-0 text-neutral-400 hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!isFirst && (
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel
            htmlFor={`section-name-${index}`}
            className="font-semibold text-neutral-700"
          >
            Nome da etapa
          </FieldLabel>

          <Input
            id={`section-name-${index}`}
            placeholder="Ex: Massa, Recheio, Cobertura..."
            className="rounded-xl border-amber-100 bg-white focus-visible:ring-amber-400"
            aria-invalid={Boolean(nameError)}
            {...form.register(`sections.${index}.name`)}
          />

          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>
      )}

      <Field data-invalid={Boolean(ingredientsError)}>
        <FieldLabel
          htmlFor={`section-ingredients-${index}`}
          className="font-semibold text-neutral-700"
        >
          Ingredientes
        </FieldLabel>

        <Textarea
          id={`section-ingredients-${index}`}
          placeholder={`2 ovos\n1 xícara de farinha\n½ colher de sal`}
          className="min-h-32 resize-none rounded-xl border-amber-100 bg-white font-mono text-sm leading-relaxed focus-visible:ring-amber-400"
          aria-invalid={Boolean(ingredientsError)}
          {...form.register(`sections.${index}.ingredientsText`)}
        />

        {ingredientsError && <FieldError>{ingredientsError}</FieldError>}
      </Field>

      <Field data-invalid={Boolean(modeError)}>
        <FieldLabel
          htmlFor={`section-mode-${index}`}
          className="font-semibold text-neutral-700"
        >
          Modo de preparo
        </FieldLabel>

        <Textarea
          id={`section-mode-${index}`}
          placeholder="Descreva o passo a passo..."
          className="min-h-48 resize-none rounded-xl border-amber-100 bg-white text-sm leading-relaxed focus-visible:ring-amber-400"
          aria-invalid={Boolean(modeError)}
          {...form.register(`sections.${index}.modeOfPreparation`)}
        />

        {modeError && <FieldError>{modeError}</FieldError>}
      </Field>
    </div>
  );
}
