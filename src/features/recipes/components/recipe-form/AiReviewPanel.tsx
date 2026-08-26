'use client';

import {
  ChefHat,
  Clock,
  Leaf,
  Lightbulb,
  Plus,
  Trash2,
  Utensils,
} from 'lucide-react';
import { Controller, type UseFormReturn, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { AiReviewFormData } from '../../schemas/recipe-ai-review-schema';

type Props = {
  form: UseFormReturn<AiReviewFormData>;
};

const difficultyOptions = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'EASY_MEDIUM', label: 'Fácil / Médio' },
  { value: 'MEDIUM', label: 'Médio' },
  { value: 'MEDIUM_HARD', label: 'Médio / Difícil' },
  { value: 'HARD', label: 'Difícil' },
] as const;

export function AiReviewPanel({ form }: Props) {
  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: 'sections',
  });

  return (
    <div className="space-y-8 overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white">
      <div className="h-1 w-full bg-[#ffb900]" aria-hidden />
      <div className="space-y-6 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center bg-[#ffb900] text-[#0a0a0a]">
            <ChefHat className="size-4" />
          </span>
          <div className="space-y-1">
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
              Análise da IA — edite antes de salvar
            </p>
            <p className="max-w-[60ch] font-sans text-sm leading-6 text-[#6b6b6b]">
              A IA sugeriu utensílios, nutrição, tempo e classificação. Revise
              com seu olhar — medidas de olhômetro valem tanto quanto gramas.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <Field>
            <FieldLabel className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
              Título
            </FieldLabel>
            <Input
              className="rounded-none border-[#0a0a0a] bg-white focus-visible:ring-[#ffb900]"
              {...form.register('title')}
            />
          </Field>

          <Field>
            <FieldLabel className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
              Resumo
            </FieldLabel>
            <Textarea
              className="resize-none rounded-none border-[#e5e5e5] bg-white text-sm leading-6 focus-visible:ring-[#ffb900]"
              rows={3}
              {...form.register('summary')}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field>
            <FieldLabel className="font-sans text-xs font-medium text-[#6b6b6b]">
              Dificuldade
            </FieldLabel>
            <select
              className="h-12 w-full rounded-none border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-[#0a0a0a] focus:border-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#ffb900]"
              {...form.register('difficulty')}
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel className="font-sans text-xs font-medium text-[#6b6b6b]">
              <Clock className="mr-1 inline size-3" />
              Preparo (min)
            </FieldLabel>
            <Input
              type="number"
              min={0}
              className="rounded-none border-[#e5e5e5] bg-white text-sm focus-visible:ring-[#ffb900]"
              {...form.register('prepTimeMinutes', { valueAsNumber: true })}
            />
          </Field>

          <Field>
            <FieldLabel className="font-sans text-xs font-medium text-[#6b6b6b]">
              <Clock className="mr-1 inline size-3" />
              Cozimento (min)
            </FieldLabel>
            <Input
              type="number"
              min={0}
              className="rounded-none border-[#e5e5e5] bg-white text-sm focus-visible:ring-[#ffb900]"
              {...form.register('cookTimeMinutes', { valueAsNumber: true })}
            />
          </Field>

          <Field>
            <FieldLabel className="font-sans text-xs font-medium text-[#6b6b6b]">
              Tipos (máx. 3)
            </FieldLabel>
            <Controller
              control={form.control}
              name="types"
              render={({ field }) => (
                <Input
                  value={field.value.join(', ')}
                  onChange={(e) => {
                    const nextTypes = e.target.value
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .slice(0, 3);
                    field.onChange(nextTypes);
                  }}
                  className="rounded-none border-[#e5e5e5] bg-white text-sm focus-visible:ring-[#ffb900]"
                  placeholder="Ex.: Prato principal, Sem carne"
                />
              )}
            />
          </Field>
        </div>

        <Separator className="bg-[#e5e5e5]" />

        <div className="space-y-4">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            Etapas
          </p>
          {sections.map((section, si) => (
            <div
              key={section.id}
              className="space-y-4 rounded-[12px] border border-[#e5e5e5] bg-white p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <Input
                  placeholder="Nome da etapa (ex.: Massa)"
                  className="max-w-[20rem] rounded-none border-[#e5e5e5] bg-white text-sm font-semibold text-[#0a0a0a] focus-visible:ring-[#ffb900]"
                  {...form.register(`sections.${si}.name`)}
                />
                {sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(si)}
                    className="size-8 rounded-none p-0 text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#cc1f1f]"
                    aria-label="Remover etapa"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>

              <IngredientList form={form} sectionIndex={si} />

              <Field>
                <FieldLabel className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Modo de preparo
                </FieldLabel>
                <Textarea
                  className="min-h-[10rem] resize-none rounded-none border-[#e5e5e5] bg-white text-sm leading-6 focus-visible:ring-[#ffb900]"
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
                ingredients: [{ originalText: '', name: '', generalName: '' }],
                modeOfPreparation: '',
              })
            }
            className="min-h-11 w-full rounded-none border border-dashed border-[#0a0a0a] bg-white text-sm font-semibold text-[#0a0a0a] hover:bg-[#f5f5f5]"
          >
            <Plus className="mr-2 size-4" />
            Adicionar etapa
          </Button>
        </div>

        <Separator className="bg-[#e5e5e5]" />

        <UtensilList form={form} />

        <div className="rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="size-4 text-[#0a0a0a]" />
            <p className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
              Sugestões de substituição
            </p>
          </div>
          <Textarea
            className="resize-none rounded-none border-[#e5e5e5] bg-white text-sm leading-6 focus-visible:ring-[#ffb900]"
            rows={3}
            {...form.register('suggestions')}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-[#0a0a0a]" />
            <p className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
              Tabela nutricional (por 100g)
            </p>
          </div>
          <Textarea
            placeholder="Resumo nutricional"
            className="resize-none rounded-none border-[#e5e5e5] bg-white text-sm italic leading-6 focus-visible:ring-[#ffb900]"
            rows={2}
            {...form.register('nutritionSummary')}
          />
          <NutritionTable form={form} />
          <p className="text-right font-sans text-xs text-[#6b6b6b]">
            * Valores estimados — edite conforme seu preparo
          </p>
        </div>
      </div>
    </div>
  );
}

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
      <FieldLabel className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
        Ingredientes
      </FieldLabel>
      <div className="space-y-2">
        {fields.map((field, ii) => (
          <div key={field.id} className="flex items-center gap-2">
            <span
              className="mt-1 size-1.5 shrink-0 rounded-full bg-[#ffb900]"
              aria-hidden
            />
            <Input
              className="rounded-none border-[#e5e5e5] bg-white text-sm focus-visible:ring-[#ffb900]"
              {...form.register(
                `sections.${sectionIndex}.ingredients.${ii}.originalText` as const,
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(ii)}
                className="size-7 shrink-0 rounded-none p-0 text-[#6b6b6b] hover:text-[#cc1f1f]"
                aria-label="Remover ingrediente"
              >
                <Trash2 className="size-3" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            append({ originalText: '', name: '', generalName: '' })
          }
          className="rounded-none px-0 text-xs font-semibold text-[#0a0a0a] hover:bg-transparent hover:text-[#ffb900] hover:underline"
        >
          <Plus className="mr-1 size-3" />
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
      <div className="mb-3 flex items-center gap-2">
        <Utensils className="size-4 text-[#0a0a0a]" />
        <p className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
          Utensílios
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, i) => (
          <span
            key={field.id}
            className="inline-flex items-center gap-1 border border-[#e5e5e5] bg-white px-3 py-1.5"
          >
            <Input
              className="h-auto w-28 border-0 bg-transparent p-0 text-xs font-medium text-[#0a0a0a] focus-visible:ring-0"
              {...form.register(`utensils.${i}.name`)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[#6b6b6b] hover:text-[#cc1f1f]"
              aria-label="Remover utensílio"
            >
              <Trash2 className="size-3" />
            </button>
          </span>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: '' })}
          className="rounded-none border-[#0a0a0a] bg-white text-xs font-semibold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white"
        >
          <Plus className="mr-1 size-3" />
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
    <div className="overflow-hidden rounded-[12px] border border-[#e5e5e5]">
      <table className="w-full text-sm">
        <tbody>
          {fields.map((field, i) => (
            <tr
              key={field.id}
              className={i % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-white'}
            >
              <td className="px-4 py-2">
                <Input
                  className="border-0 bg-transparent p-0 text-sm font-medium text-[#0a0a0a] focus-visible:ring-0"
                  {...form.register(`nutritionPer100g.${i}.nutrient`)}
                />
              </td>
              <td className="px-4 py-2 text-right">
                <Input
                  className="ml-auto border-0 bg-transparent p-0 text-right text-sm text-[#6b6b6b] focus-visible:ring-0"
                  {...form.register(`nutritionPer100g.${i}.quantity`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
