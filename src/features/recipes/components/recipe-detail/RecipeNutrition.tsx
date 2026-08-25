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
  if (!per100g?.length && !summary && suggestionItems.length === 0) return null;

  return (
    <section className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div className="border-2 border-[#0a0a0a] bg-white">
        <div className="border-b-2 border-[#0a0a0a] bg-white px-4 py-3 flex items-center gap-2">
          <Apple className="size-4 text-[#0a0a0a]" />
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            Informação nutricional
          </h2>
          <span
            className="ml-auto h-2 w-8 bg-[#ffb900] border border-[#0a0a0a]"
            aria-hidden="true"
          />
        </div>
        <div className="p-4">
          {summary && (
            <p className="border-l border-[#e5e5e5] pl-3 font-sans text-sm leading-6 text-[#6b6b6b]">
              {summary}
            </p>
          )}
          {per100g && per100g.length > 0 && (
            <div className="mt-4 overflow-hidden border-2 border-[#0a0a0a]">
              <table className="w-full text-sm">
                <thead className="bg-[#0a0a0a] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left font-display text-xs font-extrabold uppercase tracking-[0.12em]">
                      Nutriente
                    </th>
                    <th className="px-4 py-2 text-right font-display text-xs font-extrabold uppercase tracking-[0.12em]">
                      Por 100g
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {per100g.map((row) => (
                    <tr
                      key={row.nutrient}
                      className="border-t-2 border-[#0a0a0a] even:bg-[#f5f5f5]"
                    >
                      <td className="px-4 py-2 font-sans text-sm font-bold text-[#0a0a0a]">
                        {row.nutrient}
                      </td>
                      <td className="px-4 py-2 text-right font-sans text-sm text-[#6b6b6b]">
                        {row.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {per100g && per100g.length > 0 && (
            <p className="mt-2 font-sans text-xs text-[#6b6b6b]">
              Valores estimados por 100g.
            </p>
          )}
        </div>
      </div>

      {suggestionItems.length > 0 && (
        <aside className="border-2 border-[#0a0a0a] bg-[#ffb900] p-4">
          <div className="flex items-center gap-2 border-b-2 border-[#0a0a0a] pb-2">
            <Lightbulb className="size-4 text-[#0a0a0a]" />
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              Sugestões Queimando Panela
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {suggestionItems.map((item) => (
              <li
                key={item}
                className="border-2 border-[#0a0a0a] bg-white px-3 py-2 font-sans text-sm leading-5 text-[#0a0a0a]"
              >
                <span
                  className="mr-2 inline-block size-1.5 bg-[#ffb900] border border-[#0a0a0a]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
}
