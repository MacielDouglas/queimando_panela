'use client';

import { ImagePlus, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import type { UseFormReturn } from 'react-hook-form';

import type { RecipeImageInput } from '../../../types/recipe-form-images.types';

export type RecipeFormWithImages = {
  title: string;
  story?: string;
  sections: {
    id: string;
    name?: string;
    ingredientsText: string;
    modeOfPreparation: string;
  }[];
  images?: RecipeImageInput[];
};

type Props = {
  form: UseFormReturn<RecipeFormWithImages>;
};

function normalize(images: RecipeImageInput[]) {
  return images.map((image, index) => ({
    ...image,
    order: index,
    isCover: index === 0,
  }));
}

export function ImageUploadField({ form }: Props) {
  const watchedImages = form.watch('images');
  const images = useMemo(() => watchedImages ?? [], [watchedImages]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const current = (form.getValues('images') ?? []) as RecipeImageInput[];
      const available = Math.max(0, 3 - current.length);

      const nextNew: RecipeImageInput[] = accepted
        .slice(0, available)
        .map((file) => ({
          kind: 'new',
          file,
          previewUrl: URL.createObjectURL(file),
          isCover: false,
          order: 0,
        }));

      form.setValue('images', normalize([...current, ...nextNew]), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  const remove = (index: number) => {
    const current = (form.getValues('images') ?? []) as RecipeImageInput[];
    const target = current[index];

    if (target?.kind === 'new') {
      URL.revokeObjectURL(target.previewUrl);
    }

    const next = current.filter((_, i) => i !== index);

    form.setValue('images', normalize(next), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const replaceAt = (index: number, file: File) => {
    const current = (form.getValues('images') ?? []) as RecipeImageInput[];
    const old = current[index];

    if (old?.kind === 'new') {
      URL.revokeObjectURL(old.previewUrl);
    }

    const next = [...current];
    next[index] = {
      kind: 'new',
      file,
      previewUrl: URL.createObjectURL(file),
      isCover: false,
      order: 0,
    };

    form.setValue('images', normalize(next), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  useEffect(() => {
    return () => {
      for (const image of images) {
        if (image.kind === 'new') {
          URL.revokeObjectURL(image.previewUrl);
        }
      }
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 3,
    disabled: images.length >= 3,
  });

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold" style={{ color: 'var(--cocoa)' }}>
        Fotos da receita{' '}
        <span className="font-normal" style={{ color: 'var(--ink-muted)' }}>
          (opcional, até 3 imagens)
        </span>
      </p>

      <div className="flex flex-wrap gap-3">
        {images.map((image, i) => {
          const src = image.kind === 'new' ? image.previewUrl : image.url;

          return (
            <div
              key={
                image.kind === 'existing' ? image.id : `${image.file.name}-${i}`
              }
              className="relative h-28 w-28 overflow-hidden"
              style={{
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--line)',
              }}
            >
              <Image
                src={src}
                alt={`Foto ${i + 1}`}
                fill
                sizes="112px"
                className="object-cover"
                unoptimized
              />

              <div className="absolute top-1 right-1 flex gap-1">
                <label className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-neutral-900/60 text-white transition hover:bg-neutral-900/90">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      replaceAt(i, file);
                      event.currentTarget.value = '';
                    }}
                  />
                  <RefreshCw className="h-3 w-3" />
                </label>

                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900/60 text-white transition hover:bg-neutral-900/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {i === 0 && (
                <span
                  className="absolute bottom-1 left-1 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
                  }}
                >
                  Capa
                </span>
              )}
            </div>
          );
        })}

        {images.length < 3 && (
          <div
            {...getRootProps()}
            className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed transition-colors"
            style={{
              borderRadius: 'var(--radius-md)',
              borderColor: isDragActive ? 'var(--food-accent)' : 'var(--line)',
              background: isDragActive ? 'var(--food-accent-soft)' : 'white',
            }}
          >
            <input {...getInputProps()} />
            <ImagePlus
              className="h-6 w-6"
              style={{ color: 'var(--food-accent)' }}
            />
            <span
              className="text-center text-xs"
              style={{ color: 'var(--ink-muted)' }}
            >
              {isDragActive ? 'Solte aqui' : 'Adicionar foto'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
