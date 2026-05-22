export function RecipeCardSkeleton({
  aspectRatio = '4/5',
}: {
  aspectRatio?: '4/5' | '3/4' | '16/9';
}) {
  const aspectClass = {
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
  }[aspectRatio];

  return (
    <div className="flex h-full flex-col border border-neutral-200 bg-white">
      <div className={`${aspectClass} animate-pulse bg-neutral-200`} />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
      </div>
    </div>
  );
}
