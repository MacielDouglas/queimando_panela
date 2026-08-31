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
  // Normaliza sequências literais "\n" (armazenadas como texto) para quebra real,
  // garantindo que tanto "a\n\nb" (newline real) quanto "a\\n\\nb" (literal) virem parágrafos.
  const normalized = text.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  return normalized
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
          <Apple className="size-4" style={{ color: 'var(--cocoa)' }} />
          <h2
            className="text-[0.78rem] font-bold uppercase"
            style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
          >
            Informação nutricional
          </h2>
          <span
            className="ml-auto h-2 w-8 rounded-full"
            style={{ background: 'var(--food-accent)' }}
            aria-hidden="true"
          />
        </div>
        <div className="p-5">
          {summary && (
            <p
              className="border-l-2 pl-3 text-sm leading-6"
              style={{
                borderColor: 'var(--food-accent)',
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
                <thead style={{ background: 'var(--cocoa)', color: 'white' }}>
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
                        style={{ color: 'var(--cocoa)' }}
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
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
          }}
        >
          {/* colorize: yellow deixa de ser superfície e vira acento restrito (top bar 4px) */}
          <div
            className="h-1 w-full"
            style={{ background: 'var(--food-accent)' }}
            aria-hidden="true"
          />
          {/* bolder: header com hierarquia editorial — icon pill + eyebrow + título Playfair + count badge */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <div className="flex items-start gap-3">
              <span
                className="grid size-8 shrink-0 place-items-center rounded-full"
                style={{
                  background: 'var(--food-accent)',
                  color: 'var(--cocoa)',
                }}
                aria-hidden="true"
              >
                <Lightbulb className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[0.72rem] font-bold uppercase"
                  style={{ color: 'var(--cocoa)', letterSpacing: '0.1em' }}
                >
                  Sugestões
                </p>
                <h2
                  className="font-display text-[1.15rem] font-bold leading-none"
                  style={{ color: 'var(--cocoa)', letterSpacing: '-0.02em' }}
                >
                  Queimando Panela
                </h2>
              </div>
              <span
                className="shrink-0 rounded-full border bg-white px-2.5 py-1 text-xs font-bold"
                style={{
                  borderColor: 'var(--line)',
                  color: 'var(--ink-muted)',
                }}
                role="status"
                aria-label={`${suggestionItems.length} sugestões`}
              >
                {suggestionItems.length}
              </span>
            </div>
            <p
              className="mt-2.5 text-xs leading-5"
              style={{ color: 'var(--ink-muted)', textWrap: 'pretty' }}
            >
              Troca esperta, sem perder o afeto — ajuste fino pra sua panela.
            </p>
          </div>
          <ul className="space-y-3 p-5">
            {suggestionItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-[12px] px-3.5 py-3 text-sm leading-6"
                style={{
                  background: 'var(--muted)',
                  border: '1px solid var(--line)',
                  color: 'var(--cocoa)',
                  textWrap: 'pretty',
                }}
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full"
                  style={{ background: 'var(--food-accent)' }}
                  aria-hidden="true"
                />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
}
