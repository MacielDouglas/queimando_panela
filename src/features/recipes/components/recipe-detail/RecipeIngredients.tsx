import { Wheat, Wrench } from 'lucide-react';

type Ingredient = {
  id: string;
  amount: string | null;
  unit: string | null;
  originalText: string;
};

type Section = {
  name: string;
  ingredients: Ingredient[];
};

type Props = {
  sections: Section[];
  utensils: string[];
};

function formatIngredient(ingredient: Ingredient) {
  return [ingredient.amount, ingredient.unit, ingredient.originalText]
    .filter(Boolean)
    .join(' ');
}

export function RecipeIngredients({ sections, utensils }: Props) {
  return (
    <section
      className="qp-card-delight overflow-hidden bg-white"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{ borderBottom: '1px solid var(--line)', background: 'white' }}
      >
        <span
          className="grid size-8 place-items-center rounded-full"
          style={{ background: 'var(--food-accent)', color: 'var(--cocoa)' }}
        >
          <Wheat className="size-4" />
        </span>
        <h2
          className="text-[0.78rem] font-bold uppercase"
          style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
        >
          Ingredientes
        </h2>
        <span className="ml-auto text-xs" style={{ color: 'var(--ink-muted)' }}>
          {sections.reduce((acc, s) => acc + s.ingredients.length, 0)} itens
        </span>
      </div>

      <div className="space-y-6 p-5">
        {sections.map((section) => (
          <section key={section.name} className="space-y-3">
            {sections.length > 1 && (
              <h3
                className="border-l-2 pl-3 text-sm font-bold"
                style={{
                  borderColor: 'var(--food-accent)',
                  color: 'var(--cocoa)',
                  letterSpacing: '-0.01em',
                }}
              >
                {section.name}
              </h3>
            )}
            <ul className="space-y-2">
              {section.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex gap-3 rounded-[10px] bg-white px-3 py-2.5 text-sm leading-6 transition-colors hover:bg-[var(--muted)]"
                  style={{ border: '1px solid var(--line)' }}
                >
                  <span
                    className="mt-2.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--food-accent)' }}
                    aria-hidden="true"
                  />
                  <span style={{ color: 'var(--cocoa)' }}>
                    {formatIngredient(ingredient)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {utensils.length > 0 && (
          <section
            className="pt-5"
            style={{ borderTop: '1px solid var(--line)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="size-4" style={{ color: 'var(--cocoa)' }} />
              <h3
                className="text-[0.78rem] font-bold uppercase"
                style={{ color: 'var(--cocoa)', letterSpacing: '0.08em' }}
              >
                Utensílios
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {utensils.map((utensil) => (
                <li
                  key={utensil}
                  className="rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-bold"
                  style={{
                    border: '1px solid var(--line)',
                    color: 'var(--cocoa)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {utensil}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
