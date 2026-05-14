import type { NutritionRow } from '@/server/ai/groq/recipe-generator.types';

type Props = {
  rows: NutritionRow[];
  summary: string;
};

export function NutritionTable({ rows, summary }: Props) {
  if (!rows.length) return null;

  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
      <h3 className="text-sm font-semibold text-stone-900">
        Informação Nutricional <span className="font-normal text-stone-500">(por 100 g)</span>
      </h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-left text-xs text-stone-500">
            <th className="pb-2 font-medium">Nutriente</th>
            <th className="pb-2 text-right font-medium">Quantidade</th>
            <th className="pb-2 text-right font-medium">% VD*</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-stone-100 last:border-0 odd:bg-white even:bg-stone-50/60"
            >
              <td className="py-1.5 text-stone-800">{row.nutrient}</td>
              <td className="py-1.5 text-right text-stone-700">
                {row.amount} {row.unit}
              </td>
              <td className="py-1.5 text-right text-stone-500">{row.dailyValue || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {summary && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
          {summary}
        </p>
      )}

      <p className="text-[10px] text-stone-400">
        * % Valores Diários com base em uma dieta de 2.000 kcal. Valores estimados pela IA.
      </p>
    </div>
  );
}
