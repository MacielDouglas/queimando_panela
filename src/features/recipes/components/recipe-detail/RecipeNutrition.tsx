type NutritionRow = {
  nutrient: string;
  quantity: string;
};

type Props = {
  summary: string | null;
  per100g: NutritionRow[] | null;
  suggestions: string | null;
};

export function RecipeNutrition({ summary, per100g, suggestions }: Props) {
  if (!per100g && !summary) return null;

  return (
    <div className="space-y-6 rounded-3xl border border-green-100 bg-green-50/40 p-8">
      <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
        Informações nutricionais
      </h3>

      {summary && (
        <p className="text-sm leading-relaxed text-neutral-600 italic">
          {summary}
        </p>
      )}

      {per100g && per100g.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-green-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-green-100/60">
                <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-500">
                  Nutriente
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-neutral-500">
                  Por 100g
                </th>
              </tr>
            </thead>
            <tbody>
              {per100g.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-white' : 'bg-green-50/40'}
                >
                  <td className="px-4 py-2 text-neutral-700">{row.nutrient}</td>
                  <td className="px-4 py-2 text-right text-neutral-600">
                    {row.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-4 py-2 text-right text-xs text-neutral-400">
            * Valores estimados
          </p>
        </div>
      )}

      {suggestions && (
        <div className="rounded-2xl bg-blue-50 px-4 py-4">
          <p className="mb-1 text-xs font-semibold text-blue-600">
            💡 Sugestões de substituição
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">
            {suggestions}
          </p>
        </div>
      )}
    </div>
  );
}
