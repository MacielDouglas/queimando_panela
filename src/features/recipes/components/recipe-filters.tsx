import Link from 'next/link';
import type { RecipeDifficulty } from '../../../../generated/prisma/client';

type Props = {
  activeType?: string;
  activeDifficulty?: RecipeDifficulty;
};

const types: { value: string; label: string }[] = [
  { value: 'SWEET', label: 'Doce' },
  { value: 'SAVORY', label: 'Salgada' },
  { value: 'DRINK', label: 'Bebida' },
  { value: 'OTHER', label: 'Outro' },
];

const difficulties: { value: RecipeDifficulty; label: string }[] = [
  { value: 'EASY', label: 'Fácil' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HARD', label: 'Difícil' },
];

function buildUrl(type?: string, difficulty?: string) {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (difficulty) params.set('difficulty', difficulty);
  const qs = params.toString();
  return `/receitas${qs ? `?${qs}` : ''}`;
}

export function RecipeFilters({ activeType, activeDifficulty }: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* Tipo */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildUrl(undefined, activeDifficulty)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !activeType
              ? 'bg-amber-500 text-stone-950'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Todos os tipos
        </Link>
        {types.map((t) => (
          <Link
            key={t.value}
            href={buildUrl(t.value, activeDifficulty)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeType === t.value
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Dificuldade */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildUrl(activeType, undefined)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !activeDifficulty
              ? 'bg-stone-700 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          Todas as dificuldades
        </Link>
        {difficulties.map((d) => (
          <Link
            key={d.value}
            href={buildUrl(activeType, d.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeDifficulty === d.value
                ? 'bg-stone-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {d.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
