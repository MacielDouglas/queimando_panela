'use client';

import { ChefHat, Clock, Flame, Leaf, Utensils, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { AiRecipeAnalysis } from '../../types/recipe-ai.types';

type Props = {
  data: AiRecipeAnalysis;
};

const difficultyLabel = { EASY: 'Fácil', MEDIUM: 'Médio', HARD: 'Difícil' };
const difficultyColor = {
  EASY: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HARD: 'bg-red-100 text-red-700',
};

export function AiReviewPanel({ data }: Props) {
  const difficultyText =
    data.difficultyLabel || difficultyLabel[data.difficulty];

  return (
    <div className="space-y-6 rounded-3xl border border-amber-200 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
          <ChefHat className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
            Análise da IA
          </p>
          <h3 className="text-lg font-black text-neutral-900">{data.title}</h3>
        </div>
      </div>

      <p className="rounded-2xl bg-amber-100/60 px-4 py-3 text-sm leading-relaxed text-neutral-700 italic">
        🍩 {data.summary}
      </p>

      <div className="flex flex-wrap gap-3">
        <Badge
          className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColor[data.difficulty]}`}
        >
          <Flame className="mr-1 h-3 w-3" />
          {difficultyText}
        </Badge>

        <Badge className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          <Clock className="mr-1 h-3 w-3" />
          Preparo: {data.prepTimeMinutes} min
        </Badge>

        <Badge className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          <Clock className="mr-1 h-3 w-3" />
          Cozimento: {data.cookTimeMinutes} min
        </Badge>

        <Badge className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {data.type}
        </Badge>
      </div>

      <Separator className="bg-amber-100" />

      {data.sections.map((section, i) => (
        <div key={i} className="space-y-4">
          {data.sections.length > 1 && (
            <h4 className="font-bold text-amber-700">{section.name}</h4>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Ingredientes
            </p>
            <ul className="space-y-1">
              {section.ingredients.map((ing, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Modo de preparo
            </p>
            <div>
              <p className="mb-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
                Modo de preparo
              </p>

              <div className="space-y-3">
                {section.modeOfPreparation
                  .split('\n')
                  .map((step) => step.trim())
                  .filter(Boolean)
                  .map((step, j) => (
                    <div
                      key={j}
                      className="flex gap-3 text-sm text-neutral-700"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                        {j + 1}
                      </span>

                      <p>{step.replace(/^\s*\d+[.)-]?\s*/, '')}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {i < data.sections.length - 1 && (
            <Separator className="bg-amber-100" />
          )}
        </div>
      ))}

      <Separator className="bg-amber-100" />

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Utensils className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
            Utensílios
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.utensils.map((u, i) => (
            <span
              key={i}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
            >
              {u}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-blue-50 px-4 py-3">
        <div className="mb-1 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <p className="text-xs font-semibold text-blue-700">
            Sugestões de substituição
          </p>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700">
          {data.suggestions}
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Leaf className="h-4 w-4 text-green-500" />
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
            Tabela Nutricional (por 100g)
          </p>
        </div>
        <p className="mb-3 text-sm text-neutral-600 italic">
          {data.nutritionSummary}
        </p>
        <table className="w-full overflow-hidden rounded-2xl text-sm">
          <tbody>
            {data.nutritionPer100g.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? 'bg-green-50/60' : 'bg-white'}
              >
                <td className="px-4 py-2 font-medium text-neutral-700">
                  {row.nutrient}
                </td>
                <td className="px-4 py-2 text-right text-neutral-600">
                  {row.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-right text-xs text-neutral-400">
          * Valores estimados
        </p>
      </div>
    </div>
  );
}
