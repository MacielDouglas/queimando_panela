import { Wheat, Wrench } from 'lucide-react';

type Ingredient = {
  id: string;
  amount: string | null;
  unit: string | null;
  name: string;
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
  return [ingredient.amount, ingredient.unit, ingredient.name]
    .filter(Boolean)
    .join(' ');
}

export function RecipeIngredients({ sections, utensils }: Props) {
  return (
    <section
      aria-labelledby="recipe-ingredients-heading"
      className="border border-neutral-200 bg-white p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-2 border-b border-neutral-200 pb-3">
        <Wheat className="h-4 w-4 text-amber-500" />
        <h2
          id="recipe-ingredients-heading"
          className="text-sm font-bold tracking-[0.16em] text-neutral-950 uppercase"
        >
          Ingredientes
        </h2>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={`${section.name}-${index}`} className="space-y-3">
            {sections.length > 1 && (
              <h3 className="text-sm font-semibold text-neutral-900">
                {section.name}
              </h3>
            )}

            <ul className="space-y-3">
              {section.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className="flex items-start gap-3 text-sm leading-6 text-neutral-700"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-amber-500"
                  />
                  <span>{formatIngredient(ingredient)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {utensils.length > 0 && (
          <section className="border-t border-neutral-200 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold tracking-[0.16em] text-neutral-700 uppercase">
                Utensílios
              </h3>
            </div>

            <ul className="space-y-2">
              {utensils.map((utensil, index) => (
                <li
                  key={`${utensil}-${index}`}
                  className="flex items-start gap-3 text-sm leading-6 text-neutral-700"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 bg-neutral-400"
                  />
                  <span>{utensil}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
