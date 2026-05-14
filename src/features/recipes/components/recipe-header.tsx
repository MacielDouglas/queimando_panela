import Link from 'next/link';
import type { RecipeDetail } from '../actions/get-recipe';

const difficultyLabel = { EASY: 'Fácil', MEDIUM: 'Média', HARD: 'Difícil' };

type Props = { recipe: RecipeDetail };

export function RecipeHeader({ recipe }: Props) {
  return (
    <header>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          {recipe.type}
        </span>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {difficultyLabel[recipe.difficulty]}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-stone-900">{recipe.title}</h1>
      {recipe.summary && (
        <p className="mt-3 text-base leading-relaxed text-stone-600">{recipe.summary}</p>
      )}
      {recipe.story && (
        <p className="mt-4 border-l-2 border-amber-300 pl-4 text-sm italic text-stone-500">
          {recipe.story}
        </p>
      )}
      <div className="mt-4">
        <Link href="/receitas" className="text-sm text-amber-600 hover:underline">
          ← Voltar às receitas
        </Link>
      </div>
    </header>
  );
}
