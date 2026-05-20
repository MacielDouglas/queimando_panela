type Section = {
  name: string;
  ingredients: {
    id: string;
    amount: string | null;
    unit: string | null;
    name: string;
  }[];
};

type Props = {
  sections: Section[];
  utensils: string[];
};

export function RecipeIngredients({ sections, utensils }: Props) {
  return (
    <div className="space-y-8 rounded-3xl border border-amber-100 bg-white/70 p-8">
      {sections.map((section, i) => (
        <div key={i} className="space-y-4">
          {sections.length > 1 && (
            <h3 className="font-bold text-amber-700">{section.name}</h3>
          )}

          {sections.length === 1 && (
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Ingredientes
            </h3>
          )}

          <ul className="space-y-2">
            {section.ingredients.map((ing) => (
              <li
                key={ing.id}
                className="flex items-start gap-3 text-sm text-neutral-700"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>
                  {ing.amount && (
                    <span className="font-semibold">{ing.amount} </span>
                  )}
                  {ing.unit && (
                    <span className="text-neutral-500">{ing.unit} </span>
                  )}
                  {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {utensils.length > 0 && (
        <div className="space-y-3 border-t border-amber-100 pt-6">
          <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
            Utensílios
          </h3>
          <ul className="space-y-2">
            {utensils.map((u, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm text-neutral-700"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
