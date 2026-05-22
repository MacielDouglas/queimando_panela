import { RecipeCardSkeleton } from '@/features/recipes/components/recipe-list/RecipeCardSkeleton';

export default function RecipesLoading() {
  return (
    <main className="min-h-dvh bg-neutral-50 pb-20">
      {/* Header skeleton */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="editorial-container py-6 sm:py-8">
          <div className="h-5 w-64 animate-pulse rounded bg-neutral-200" />
          <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-neutral-200" />
          <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-neutral-200" />
        </div>
      </section>

      {/* Busca skeleton */}
      <section className="border-b border-neutral-200 bg-neutral-950">
        <div className="editorial-container py-6 sm:py-8">
          <div className="h-14 w-full animate-pulse rounded bg-neutral-800" />
        </div>
      </section>

      <div className="editorial-container py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-10">
          <div className="space-y-10">
            {/* Hero skeleton */}
            <div className="grid border border-neutral-200 sm:grid-cols-[1.4fr_1fr]">
              <div className="aspect-video animate-pulse bg-neutral-200 sm:aspect-auto sm:min-h-105" />
              <div className="space-y-4 p-6">
                <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                <div className="h-8 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
                <div className="mt-8 h-12 w-full animate-pulse rounded bg-neutral-200" />
              </div>
            </div>

            {/* Grid skeleton */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-4 border border-neutral-200 bg-white p-5">
            <div className="h-3 w-32 animate-pulse rounded bg-neutral-200" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded bg-neutral-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
