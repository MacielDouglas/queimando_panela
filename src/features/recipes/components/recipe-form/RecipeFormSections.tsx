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
    <section
      className="space-y-5 bg-white p-5 sm:p-7"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <div
        className="flex items-center justify-between gap-4 pb-4"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="h-1 w-8"
            style={{ background: 'var(--food-accent)' }}
            aria-hidden="true"
          />
          <h2
            className="font-display text-xs font-extrabold uppercase"
            style={{ letterSpacing: '0.14em', color: 'var(--cocoa)' }}
          >
            {sections.length > 1 ? 'Etapas da receita' : 'Receita'}
          </h2>
        </div>
        <span
          className="rounded-full border bg-white px-2.5 py-1 font-sans text-xs font-bold"
          style={{
            borderColor: 'var(--line)',
            color: 'var(--ink-muted)',
          }}
        >
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
        className="min-h-11 w-full rounded-full border border-dashed bg-white text-sm font-bold hover:bg-[var(--muted)]"
        style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
      >
        <Plus className="mr-2 size-4" />
        Adicionar etapa
      </Button>
    </section>
  );
}
