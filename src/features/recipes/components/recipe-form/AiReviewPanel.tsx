'use client';

// import { UseFormReturn, useFieldArray } from 'react-hook-form';
import {
  Plus,
  Trash2,
  ChefHat,
  Clock,
  Leaf,
  Utensils,
  Lightbulb,
} from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import type { AiReviewFormData } from '../../schemas/recipe-ai-review-schema';

type Props = {
  form: UseFormReturn<AiReviewFormData>;
};

const difficultyOptions = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'HARD', label: 'Difícil' },
] as const;

const difficultyColor = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
};

export function AiReviewPanel({ form }: Props) {
  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  const difficulty = form.watch('difficulty');

  return (
    <div className="space-y-6 rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
          <ChefHat className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
            Análise da IA — edite antes de salvar
          </p>
        </div>
      </div>

      {/* Título */}
      <Field>
        <FieldLabel className="font-semibold text-neutral-700">
          Título
        </FieldLabel>
        <Input
          className="rounded-xl border-amber-100 bg-white focus-visible:ring-amber-400"
          {...form.register('title')}
        />
      </Field>

      {/* Resumo */}
      <Field>
        <FieldLabel className="font-semibold text-neutral-700">
          Resumo
        </FieldLabel>
        <Textarea
          className="resize-none rounded-xl border-amber-100 bg-white text-sm focus-visible:ring-amber-400"
          rows={3}
          {...form.register('summary')}
        />
      </Field>

      {/* Badges editáveis */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field>
          <FieldLabel className="text-xs text-neutral-500">
            Dificuldade
          </FieldLabel>
          <select
            className={`w-full rounded-full border-0 px-3 py-1 text-xs font-semibold ${difficultyColor[difficulty ?? 'EASY']}`}
            {...form.register('difficulty')}
          >
            {difficultyOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field>
          <FieldLabel className="text-xs text-neutral-500">
            <Clock className="mr-1 inline h-3 w-3" />
            Preparo (min)
          </FieldLabel>
          <Input
            type="number"
            min={0}
            className="rounded-xl border-amber-100 bg-white text-sm"
            {...form.register('prepTimeMinutes', { valueAsNumber: true })}
          />
        </Field>

        <Field>
          <FieldLabel className="text-xs text-neutral-500">
            <Clock className="mr-1 inline h-3 w-3" />
            Cozimento (min)
          </FieldLabel>
          <Input
            type="number"
            min={0}
            className="rounded-xl border-amber-100 bg-white text-sm"
            {...form.register('cookTimeMinutes', { valueAsNumber: true })}
          />
        </Field>

        <Field>
          <FieldLabel className="text-xs text-neutral-500">Tipo</FieldLabel>
          <Input
            className="rounded-xl border-amber-100 bg-white text-sm"
            {...form.register('type')}
          />
        </Field>
      </div>

      <Separator className="bg-amber-100" />

      {/* Seções editáveis */}
      {sections.map((section, si) => (
        <div
          key={section.id}
          className="space-y-4 rounded-2xl border border-amber-100 bg-white/60 p-4"
        >
          <div className="flex items-center justify-between">
            <Input
              placeholder="Nome da etapa"
              className="max-w-50 rounded-xl border-amber-100 bg-white font-bold text-amber-700 focus-visible:ring-amber-400"
              {...form.register(`sections.${si}.name`)}
            />
            {sections.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(si)}
                className="h-8 w-8 rounded-full p-0 text-neutral-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Ingredientes */}
          <IngredientList form={form} sectionIndex={si} />

          {/* Modo de preparo */}
          <Field>
            <FieldLabel className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Modo de preparo
            </FieldLabel>
            <Textarea
              className="min-h-40 resize-none rounded-xl border-amber-100 bg-white text-sm leading-relaxed focus-visible:ring-amber-400"
              {...form.register(`sections.${si}.modeOfPreparation`)}
            />
          </Field>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          appendSection({
            name: '',
            ingredients: [{ text: '' }],
            modeOfPreparation: '',
          })
        }
        className="w-full rounded-2xl border-dashed border-amber-300 text-amber-700 hover:border-amber-400 hover:bg-amber-50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar etapa
      </Button>

      <Separator className="bg-amber-100" />

      {/* Utensílios */}
      <UtensilList form={form} />

      {/* Sugestões */}
      <div className="rounded-2xl bg-blue-50 px-4 py-3">
        <div className="mb-1 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <p className="text-xs font-semibold text-blue-700">
            Sugestões de substituição
          </p>
        </div>
        <Textarea
          className="resize-none rounded-xl border-blue-100 bg-white text-sm leading-relaxed focus-visible:ring-blue-400"
          rows={3}
          {...form.register('suggestions')}
        />
      </div>

      {/* Tabela nutricional */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-500" />
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
            Tabela Nutricional (por 100g)
          </p>
        </div>
        <Textarea
          placeholder="Resumo nutricional"
          className="mb-3 resize-none rounded-xl border-amber-100 bg-white text-sm italic"
          rows={2}
          {...form.register('nutritionSummary')}
        />
        <NutritionTable form={form} />
        <p className="mt-2 text-right text-xs text-neutral-400">
          * Valores estimados
        </p>
      </div>
    </div>
  );
}

// --- Sub-componentes internos ---

function IngredientList({
  form,
  sectionIndex,
}: {
  form: UseFormReturn<AiReviewFormData>;
  sectionIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `sections.${sectionIndex}.ingredients`,
  });

  return (
    <Field>
      <FieldLabel className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
        Ingredientes
      </FieldLabel>
      <div className="space-y-2">
        {fields.map((field, ii) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            <Input
              className="rounded-xl border-amber-100 bg-white text-sm focus-visible:ring-amber-400"
              {...form.register(
                `sections.${sectionIndex}.ingredients.${ii}.text`,
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(ii)}
                className="h-7 w-7 shrink-0 rounded-full p-0 text-neutral-300 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ text: '' })}
          className="text-xs text-amber-600 hover:text-amber-700"
        >
          <Plus className="mr-1 h-3 w-3" />
          Ingrediente
        </Button>
      </div>
    </Field>
  );
}

function UtensilList({ form }: { form: UseFormReturn<AiReviewFormData> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'utensils',
  });

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Utensils className="h-4 w-4 text-amber-500" />
        <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          Utensílios
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1"
          >
            <Input
              className="h-auto w-32 border-0 bg-transparent p-0 text-xs text-neutral-600 focus-visible:ring-0"
              {...form.register(`utensils.${i}.name`)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-neutral-300 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ name: '' })}
          className="rounded-full text-xs text-amber-600"
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}

function NutritionTable({ form }: { form: UseFormReturn<AiReviewFormData> }) {
  const { fields } = useFieldArray({
    control: form.control,
    name: 'nutritionPer100g',
  });

  return (
    <table className="w-full overflow-hidden rounded-2xl text-sm">
      <tbody>
        {fields.map((field, i) => (
          <tr
            key={field.id}
            className={i % 2 === 0 ? 'bg-green-50/60' : 'bg-white'}
          >
            <td className="px-4 py-2 font-medium text-neutral-700">
              <Input
                className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                {...form.register(`nutritionPer100g.${i}.nutrient`)}
              />
            </td>
            <td className="px-4 py-2 text-right">
              <Input
                className="ml-auto border-0 bg-transparent p-0 text-right text-sm text-neutral-600 focus-visible:ring-0"
                {...form.register(`nutritionPer100g.${i}.quantity`)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
