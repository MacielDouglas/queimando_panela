import { Apple, Lightbulb } from 'lucide-react';

type NutritionRow = {
  nutrient: string;
  quantity: string;
};

type Props = {
  summary: string | null;
  per100g: NutritionRow[] | null;
  suggestions: string | null;
};

function splitSuggestions(text: string | null) {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function RecipeNutrition({ summary, per100g, suggestions }: Props) {
  const suggestionItems = splitSuggestions(suggestions);

  if (!per100g?.length && !summary && suggestionItems.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div
        aria-labelledby="recipe-nutrition-heading"
        className="border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8"
      >
        <div className="mb-5 flex items-center gap-2 border-b border-neutral-200 pb-3">
          <Apple className="h-4 w-4 text-amber-500" />
          <h2
            id="recipe-nutrition-heading"
            className="text-sm font-bold tracking-[0.16em] text-neutral-950 uppercase"
          >
            Informação nutricional
          </h2>
        </div>

        {summary && (
          <p className="mb-5 text-sm leading-7 text-neutral-700">{summary}</p>
        )}

        {per100g && per100g.length > 0 && (
          <>
            <div className="overflow-x-auto border border-neutral-200">
              <table className="w-full min-w-70 text-sm">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">
                      Nutriente
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-neutral-700">
                      Por 100g
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {per100g.map((row, index) => (
                    <tr
                      key={`${row.nutrient}-${index}`}
                      className="border-t border-neutral-200"
                    >
                      <td className="px-4 py-3 text-neutral-700">
                        {row.nutrient}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-600">
                        {row.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              Valores estimados por 100 g.
            </p>
          </>
        )}
      </div>

      {suggestionItems.length > 0 && (
        <aside className="border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-amber-200 pb-3">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-bold tracking-[0.16em] text-amber-800 uppercase">
              Sugestões
            </h2>
          </div>

          <ul className="space-y-3">
            {suggestionItems.map((item, index) => (
              <li
                key={`${index}-${item.slice(0, 20)}`}
                className="flex items-start gap-3 text-sm leading-6 text-neutral-700"
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
}
