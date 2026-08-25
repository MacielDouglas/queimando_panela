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
    <section className="border-2 border-[#0a0a0a] bg-white">
      <div className="border-b-2 border-[#0a0a0a] bg-[#ffb900] px-4 py-3 flex items-center gap-2">
        <Wheat className="size-4 text-[#0a0a0a]" />
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
          Ingredientes
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {sections.map((section) => (
          <section key={section.name} className="space-y-3">
            {sections.length > 1 && (
              <h3 className="border-l border-[#e5e5e5] pl-2 font-display text-sm font-extrabold uppercase text-[#0a0a0a]">
                {section.name}
              </h3>
            )}
            <ul className="space-y-2">
              {section.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex gap-3 border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-2 font-sans text-sm leading-6 text-[#0a0a0a]"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 bg-[#ffb900] border border-[#0a0a0a]"
                    aria-hidden="true"
                  />
                  <span>{formatIngredient(ingredient)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {utensils.length > 0 && (
          <section className="border-t-2 border-[#0a0a0a] pt-4">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="size-4 text-[#0a0a0a]" />
              <h3 className="font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
                Utensílios
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {utensils.map((utensil) => (
                <li
                  key={utensil}
                  className="border-2 border-[#0a0a0a] bg-white px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.08em] text-[#0a0a0a]"
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
