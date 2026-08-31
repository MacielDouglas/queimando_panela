'use client';

import { Check, Wheat, Wrench } from 'lucide-react';
import { useState } from 'react';

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
  const total = sections.reduce((acc, s) => acc + s.ingredients.length, 0);
  const [checked, setChecked] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allDone = total > 0 && checked.size === total;

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
          className="grid size-8 shrink-0 place-items-center rounded-full"
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
        <span
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-xs font-bold transition-colors"
          style={{
            borderColor: allDone ? 'var(--food-accent)' : 'var(--line)',
            color: allDone ? 'var(--cocoa)' : 'var(--ink-muted)',
            background: allDone ? 'var(--food-accent)' : 'white',
          }}
          aria-live="polite"
        >
          <span>
            {checked.size}/{total}
          </span>
          <span className="hidden sm:inline"> itens</span>
        </span>
      </div>

      {allDone && (
        <div
          className="mx-5 mt-4 rounded-full px-3 py-2 text-center text-xs font-bold"
          style={{
            background: 'var(--food-accent)',
            color: 'var(--cocoa)',
            letterSpacing: '0.04em',
          }}
          role="status"
          aria-live="polite"
        >
          Mise en place pronta! Bora pra panela ✨
        </div>
      )}

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
              {section.ingredients.map((ingredient) => {
                const isChecked = checked.has(ingredient.id);
                return (
                  <li key={ingredient.id}>
                    <label
                      className="group flex w-full cursor-pointer items-center gap-3 rounded-[10px] bg-white px-3 py-2.5 text-left text-sm leading-6 transition-all hover:bg-[var(--muted)] has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[var(--gold)]"
                      style={{
                        border: '1px solid var(--line)',
                        background: isChecked ? 'var(--muted)' : 'white',
                        opacity: isChecked ? 0.85 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(ingredient.id)}
                        className="sr-only"
                        aria-label={formatIngredient(ingredient)}
                      />
                      <span
                        className="grid size-5 shrink-0 place-items-center rounded-full border text-[10px] transition-all duration-200"
                        style={{
                          borderColor: isChecked
                            ? 'var(--food-accent)'
                            : 'var(--line)',
                          background: isChecked
                            ? 'var(--food-accent)'
                            : 'white',
                          color: isChecked ? 'var(--cocoa)' : 'transparent',
                          transform: isChecked ? 'scale(1.05)' : 'scale(1)',
                        }}
                        aria-hidden="true"
                      >
                        <Check
                          className="size-3"
                          style={{
                            opacity: isChecked ? 1 : 0,
                            transform: isChecked ? 'scale(1)' : 'scale(0.5)',
                            transition:
                              'opacity 180ms ease, transform 180ms cubic-bezier(0.25,1,0.5,1)',
                          }}
                        />
                        {!isChecked && (
                          <span
                            className="size-1.5 rounded-full"
                            style={{ background: 'var(--food-accent)' }}
                          />
                        )}
                      </span>
                      <span
                        style={{
                          color: isChecked
                            ? 'var(--ink-muted)'
                            : 'var(--cocoa)',
                          textDecorationLine: isChecked
                            ? 'line-through'
                            : 'none',
                          textDecorationColor: 'var(--food-accent)',
                          textDecorationThickness: '2px',
                        }}
                        className="transition-colors"
                      >
                        {formatIngredient(ingredient)}
                      </span>
                    </label>
                  </li>
                );
              })}
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
                  className="rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-bold transition-transform hover:-translate-y-0.5"
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
