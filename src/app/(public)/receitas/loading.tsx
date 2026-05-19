export default function LoadingRecipesPage() {
  return (
    <main className="editorial-container py-24">
      <div className="space-y-6">
        <div
          data-testid="loading-hero-chip"
          className="h-5 w-44 animate-pulse rounded-full bg-amber-100"
        />

        <div
          data-testid="loading-hero-title"
          className="h-16 w-full max-w-2xl animate-pulse rounded-3xl bg-neutral-200/70"
        />

        <div
          data-testid="loading-hero-description"
          className="h-6 w-full max-w-3xl animate-pulse rounded-full bg-neutral-200/60"
        />
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            data-testid="recipe-skeleton-card"
            className="overflow-hidden rounded-4xl border border-white/50 bg-white/70 p-4 shadow-sm"
          >
            <div className="aspect-4/3 animate-pulse rounded-[1.5rem] bg-neutral-200/70" />

            <div className="mt-5 space-y-4">
              <div className="h-5 w-24 animate-pulse rounded-full bg-amber-100" />
              <div className="h-8 w-full animate-pulse rounded-2xl bg-neutral-200/70" />
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-neutral-200/60" />
              <div className="h-5 w-1/3 animate-pulse rounded-full bg-neutral-200/50" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
