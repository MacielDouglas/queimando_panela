export default function Loading() {
  return (
    <main className="bg-background min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero skeleton */}
        <div className="mb-12 aspect-4/3 animate-pulse rounded-none bg-amber-100 sm:aspect-video lg:aspect-21/9" />

        {/* Latest recipes skeleton */}
        <div className="mb-12">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-amber-100" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-4/3 animate-pulse rounded-lg bg-amber-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-amber-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-amber-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Classic recipes skeleton */}
        <div className="mb-12">
          <div className="mb-6 h-6 w-56 animate-pulse rounded bg-amber-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border border-amber-200 p-4">
                <div className="h-5 w-24 animate-pulse rounded bg-amber-100" />
                <div className="h-4 w-full animate-pulse rounded bg-amber-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-amber-100" />
              </div>
            ))}
          </div>
        </div>

        {/* SignUp skeleton */}
        <div className="mb-12 h-80 animate-pulse rounded-xl bg-neutral-950" />
      </div>
    </main>
  );
}
