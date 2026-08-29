export function RecipeCardSkeleton({
  aspectRatio = '4/5',
}: {
  aspectRatio?: '4/5' | '3/4' | '16/9' | '4/3';
}) {
  const aspectClass = {
    '4/5': 'aspect-[4/5]',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
  }[aspectRatio];

  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-white"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <div
        className={`${aspectClass} animate-pulse`}
        style={{ background: 'var(--muted)' }}
      />
      <div className="space-y-3 p-4">
        <div
          className="h-4 w-3/4 animate-pulse rounded"
          style={{ background: 'var(--muted)' }}
        />
        <div
          className="h-3 w-full animate-pulse rounded"
          style={{ background: 'var(--line)' }}
        />
        <div
          className="h-3 w-1/2 animate-pulse rounded"
          style={{ background: 'var(--line)' }}
        />
      </div>
    </div>
  );
}
