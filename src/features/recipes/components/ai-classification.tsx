'use client';

import type { ParsedClassification } from '../types/recipe-form.types';

type Props = {
  classification: ParsedClassification | null;
};

export function AiClassification({ classification }: Props) {
  if (!classification) {
    return <p className="text-sm text-stone-500">Gere a análise para ver as classificações.</p>;
  }

  return (
    <div className="space-y-4">
      <BadgeGroup title="Grupo principal" items={[classification.primaryGroup]} />
      <BadgeGroup title="Categorias" items={classification.mainCategories} />
      <BadgeGroup title="Nutrição" items={classification.nutritionTags} />
      <BadgeGroup title="Ocasião" items={classification.courseTypes} />
    </div>
  );
}

function BadgeGroup({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
