'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';
import type { RecipeFormData } from '../../../schemas/recipe.schema';

type Props = {
  form: UseFormReturn<RecipeFormData>;
};

export function ImageUploadField({ form }: Props) {
  const images = form.watch('images') ?? [];

  const onDrop = useCallback(
    (accepted: File[]) => {
      const current = form.getValues('images') ?? [];
      const merged = [...current, ...accepted].slice(0, 3);
      form.setValue('images', merged, { shouldValidate: true });
    },
    [form],
  );

  const remove = (i: number) => {
    const next = [...images];
    next.splice(i, 1);
    form.setValue('images', next, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 3,
    disabled: images.length >= 3,
  });

  return (
    <div className="space-y-3">
      <p className="text-base font-semibold text-neutral-800">
        Fotos da receita{' '}
        <span className="font-normal text-neutral-400">
          (opcional, até 3 imagens)
        </span>
      </p>

      <div className="flex flex-wrap gap-3">
        {images.map((file, i) => (
          <div
            key={i}
            className="relative h-28 w-28 overflow-hidden rounded-2xl border border-amber-100"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/60 text-white transition hover:bg-neutral-900/90"
            >
              <X className="h-3 w-3" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                Capa
              </span>
            )}
          </div>
        ))}

        {images.length < 3 && (
          <div
            {...getRootProps()}
            className={`flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed transition-colors ${
              isDragActive
                ? 'border-amber-400 bg-amber-50'
                : 'border-amber-200 bg-white/60 hover:border-amber-400 hover:bg-amber-50'
            }`}
          >
            <input {...getInputProps()} />
            <ImagePlus className="h-6 w-6 text-amber-400" />
            <span className="text-center text-xs text-neutral-500">
              {isDragActive ? 'Solte aqui' : 'Adicionar foto'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
