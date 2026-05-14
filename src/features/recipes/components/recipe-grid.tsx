import type { RecipeListItem } from '../actions/get-all-recipes';
import { RecipeCardItem } from './recipe-card-item';

type Props = {
  recipes: RecipeListItem[];
};

export function RecipeGrid({ recipes }: Props) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-4xl">🍳</p>
        <h2 className="mt-4 text-lg font-semibold text-stone-900">Nenhuma receita encontrada</h2>
        <p className="mt-1 text-sm text-stone-500">
          Tente remover os filtros ou adicione uma nova receita.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCardItem key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
