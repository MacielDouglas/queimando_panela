'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  defaultImageUrl?: string | null;
};

export function RecipeImageInput({ defaultImageUrl }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImageUrl ?? null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewUrl(defaultImageUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl((current) => {
      if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
      return objectUrl;
    });
  }

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-3">
      <label htmlFor="image" className="block text-sm font-medium text-stone-800">
        Imagem da receita
      </label>

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
          <Image
            src={previewUrl}
            alt="Pré-visualização da imagem da receita"
            width={1200}
            height={800}
            className="h-64 w-full object-cover"
            unoptimized
            // unoptimized={previewUrl.startsWith('blob:')}
          />
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-sm text-stone-500">
          Nenhuma imagem selecionada
        </div>
      )}

      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-stone-700 file:mr-4 file:rounded-full file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-stone-950 hover:file:bg-amber-400"
      />

      <p className="text-xs text-stone-500">
        A imagem será convertida para WebP e otimizada para até 2 MB.
      </p>
    </div>
  );
}
