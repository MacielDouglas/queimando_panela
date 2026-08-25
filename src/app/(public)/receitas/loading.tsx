import { RecipeCardSkeleton } from '@/features/recipes/components/recipe-list/RecipeCardSkeleton';

export default function RecipesLoading() {
  return (
    <main className="bg-white">
      <section className="border-b-2 border-[#0a0a0a] bg-white">
        <div className="editorial-container py-8">
          <div className="h-6 w-40 bg-[#ffb900] border border-[#0a0a0a]" />
          <div className="mt-6 h-12 w-3/4 bg-[#0a0a0a]" />
          <div className="mt-3 h-4 w-1/2 bg-[#f5f5f5] border border-[#e5e5e5]" />
        </div>
      </section>

      <section className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a]">
        <div className="editorial-container py-6">
          <div className="h-12 w-full bg-white border-2 border-[#0a0a0a]" />
        </div>
      </section>

      <div className="editorial-container py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="space-y-10">
            <div className="grid border-2 border-[#0a0a0a] sm:grid-cols-[1.2fr_1fr]">
              <div className="aspect-[4/3] bg-[#f5f5f5] border-r-2 border-[#0a0a0a]" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-20 bg-[#ffb900]" />
                <div className="h-6 w-full bg-[#0a0a0a]" />
                <div className="h-4 w-3/4 bg-[#e5e5e5]" />
                <div className="mt-6 h-12 w-full bg-[#0a0a0a]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'skeleton-1',
                'skeleton-2',
                'skeleton-3',
                'skeleton-4',
                'skeleton-5',
                'skeleton-6',
              ].map((key) => (
                <RecipeCardSkeleton key={key} />
              ))}
            </div>
          </div>

          <div className="border-2 border-[#0a0a0a] bg-white p-4">
            <div className="h-4 w-32 bg-[#0a0a0a]" />
            <div className="mt-4 flex flex-wrap gap-2">
              {['chip-1', 'chip-2', 'chip-3', 'chip-4', 'chip-5', 'chip-6'].map(
                (key) => (
                  <div
                    key={key}
                    className="h-8 w-20 bg-[#f5f5f5] border border-[#e5e5e5]"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
