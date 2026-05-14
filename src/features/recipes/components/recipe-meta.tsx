import type { RecipeDetail } from '../actions/get-recipe';

type Props = { recipe: RecipeDetail };

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-stone-50 px-4 py-3">
      <span className="text-lg font-semibold text-stone-900">{value}</span>
      <span className="text-xs text-stone-500">{label}</span>
    </div>
  );
}

export function RecipeMeta({ recipe }: Props) {
  const items = [
    recipe.prepTimeMinutes && { label: 'Preparo', value: `${recipe.prepTimeMinutes} min` },
    recipe.cookTimeMinutes && { label: 'Forno', value: `${recipe.cookTimeMinutes} min` },
    recipe.servings && { label: 'Porções', value: String(recipe.servings) },
  ].filter(Boolean) as { label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-3 gap-3 border-y border-stone-200 py-4">
      {items.map((item) => (
        <MetaItem key={item.label} {...item} />
      ))}
    </div>
  );
}
