'use client';

import { Plus } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { RecipeFormWithImages } from './fields/ImageUploadField';
import { SectionField } from './fields/SectionField';

type Props = {
  form: UseFormReturn<RecipeFormWithImages>;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export function RecipeFormSections({ form, onAdd, onRemove }: Props) {
  const sections = form.watch('sections') ?? [];

  return (
    <section className="space-y-5 rounded-[12px] border border-[#e5e5e5] bg-white p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
        <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-[#0a0a0a]">
          {sections.length > 1 ? 'Etapas da receita' : 'Receita'}
        </h2>
        <span className="font-sans text-xs text-[#6b6b6b]">
          {sections.length} {sections.length === 1 ? 'etapa' : 'etapas'}
        </span>
      </div>

      {sections.map((section, index) => (
        <SectionField
          key={section.id}
          form={form}
          index={index}
          isOnly={sections.length === 1}
          onRemove={() => onRemove(index)}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="min-h-11 w-full rounded-none border border-dashed border-[#0a0a0a] bg-white text-sm font-semibold text-[#0a0a0a] hover:bg-[#f5f5f5]"
      >
        <Plus className="mr-2 size-4" />
        Adicionar etapa
      </Button>
    </section>
  );
}
