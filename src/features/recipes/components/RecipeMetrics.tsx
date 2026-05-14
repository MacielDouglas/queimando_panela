type Props = {
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  servings?: number | null;
  ingredientsCount: number;
};

type MetricItem = {
  value: number;
  label: string;
};

export function RecipeMetrics({
  prepTimeMinutes,
  cookTimeMinutes,
  servings,
  ingredientsCount,
}: Props) {
  const items: MetricItem[] = [
    prepTimeMinutes ? { value: prepTimeMinutes, label: 'min preparo' } : null,
    cookTimeMinutes ? { value: cookTimeMinutes, label: 'min forno' } : null,
    servings ? { value: servings, label: 'porções' } : null,
    { value: ingredientsCount, label: 'ingredientes' },
  ].filter(Boolean) as MetricItem[];

  if (items.length === 0) return null;

  return (
    <div className="mx-auto mb-10 max-w-5xl px-4 md:px-8">
      <div className="flex flex-wrap gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200">
        {items.map(({ value, label }) => (
          <div key={label} className="flex flex-1 flex-col items-center bg-white px-6 py-4">
            <span className="text-xl font-bold text-stone-900">{value}</span>
            <span className="text-xs text-stone-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
