import Image from 'next/image';
import { Clock, Flame, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  title: string;
  summary: string | null;
  type: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  coverUrl: string | null;
  authorName: string;
};

const difficultyLabel = { EASY: 'Fácil', MEDIUM: 'Médio', HARD: 'Difícil' };

export function RecipeDetailHero({
  title,
  summary,
  type,
  difficulty,
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  coverUrl,
  authorName,
}: Props) {
  const totalTime = (prepTimeMinutes ?? 0) + (cookTimeMinutes ?? 0);

  return (
    <section className="editorial-container pt-24">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {type && (
              <Badge className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {type}
              </Badge>
            )}
            <Badge className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
              <Flame className="mr-1 h-3 w-3" />
              {difficultyLabel[difficulty]}
            </Badge>
          </div>

          <h1 className="text-5xl leading-tight font-black tracking-tight text-neutral-900 lg:text-6xl">
            {title}
          </h1>

          {summary && (
            <p className="max-w-xl text-lg leading-8 text-neutral-600">
              {summary}
            </p>
          )}

          <p className="text-sm text-neutral-500">
            por{' '}
            <span className="font-semibold text-neutral-800">{authorName}</span>
          </p>

          <div className="flex flex-wrap gap-6 border-t border-amber-100 pt-6">
            {totalTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs text-neutral-400">Tempo total</p>
                  <p className="font-bold text-neutral-800">{totalTime} min</p>
                </div>
              </div>
            )}

            {prepTimeMinutes && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">Preparo</p>
                  <p className="font-bold text-neutral-800">
                    {prepTimeMinutes} min
                  </p>
                </div>
              </div>
            )}

            {servings && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">Porções</p>
                  <p className="font-bold text-neutral-800">{servings}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {coverUrl && (
          <div className="relative aspect-square overflow-hidden rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.10)]">
            <Image
              src={coverUrl}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
