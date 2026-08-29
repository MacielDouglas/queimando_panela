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
    <section className="qp-reveal grid gap-6 xl:grid-cols-[1fr_320px]">
      <div
        className="overflow-hidden bg-white"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)',
        }}
      >
        <div
          className="flex items-center gap-2 px-5 py-4"
          style={{ borderBottom: '1px solid var(--line)', background: 'white' }}
        >
          <Apple className="size-4" style={{ color: 'var(--forest)' }} />
          <h2
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
          >
            Informação nutricional
          </h2>
          <span
            className="ml-auto h-2 w-8 rounded-full"
            style={{ background: 'var(--accent-e)' }}
            aria-hidden="true"
          />
        </div>
        <div className="p-5">
          {summary && (
            <p
              className="border-l-2 pl-3 text-sm leading-6"
              style={{
                borderColor: 'var(--accent-e)',
                color: 'var(--ink-muted)',
                textWrap: 'pretty',
              }}
            >
              {summary}
            </p>
          )}
          {per100g && per100g.length > 0 && (
            <div
              className="mt-4 overflow-hidden"
              style={{ borderRadius: '14px', border: '1px solid var(--line)' }}
            >
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--forest)', color: 'white' }}>
                  <tr>
                    <th
                      className="px-4 py-2.5 text-left text-[0.78rem] font-bold uppercase"
                      style={{ letterSpacing: '0.06em' }}
                    >
                      Nutriente
                    </th>
                    <th
                      className="px-4 py-2.5 text-right text-[0.78rem] font-bold uppercase"
                      style={{ letterSpacing: '0.06em' }}
                    >
                      Por 100g
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {per100g.map((row) => (
                    <tr
                      key={row.nutrient}
                      className="even:bg-[var(--muted)]"
                      style={{ borderTop: '1px solid var(--line)' }}
                    >
                      <td
                        className="px-4 py-2.5 text-sm font-bold"
                        style={{ color: 'var(--forest)' }}
                      >
                        {row.nutrient}
                      </td>
                      <td
                        className="px-4 py-2.5 text-right text-sm"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        {row.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {per100g && per100g.length > 0 && (
            <p className="mt-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
              Valores estimados por 100g.
            </p>
          )}
        </div>
      </div>

      {suggestionItems.length > 0 && (
        <aside
          className="p-5"
          style={{
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-e)',
            border: '1px solid var(--line)',
          }}
        >
          <div
            className="flex items-center gap-2 pb-3"
            style={{ borderBottom: '1px solid rgba(24,58,55,0.12)' }}
          >
            <Lightbulb className="size-4" style={{ color: 'var(--forest)' }} />
            <h2
              className="text-[0.78rem] font-bold uppercase"
              style={{ color: 'var(--forest)', letterSpacing: '0.08em' }}
            >
              Sugestões Queimando Panela
            </h2>
          </div>
          <ul className="mt-3 space-y-2">
            {suggestionItems.map((item) => (
              <li
                key={item}
                className="rounded-[10px] bg-white px-3 py-2.5 text-sm leading-5"
                style={{
                  border: '1px solid var(--line)',
                  color: 'var(--forest)',
                  textWrap: 'pretty',
                }}
              >
                <span
                  className="mr-2 inline-block size-1.5 rounded-full"
                  style={{ background: 'var(--accent-e)' }}
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
