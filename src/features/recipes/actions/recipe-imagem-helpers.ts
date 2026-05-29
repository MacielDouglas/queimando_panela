type ExistingImagePayload = {
  id: string;
  key: string;
  url: string;
  alt: string;
};

type UploadedImage = {
  key: string;
  url: string;
  alt: string;
  contentType?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
};

export type FinalExistingImage = ExistingImagePayload & {
  kind: 'existing';
  order: number;
  isCover: boolean;
};

export type FinalNewImage = UploadedImage & {
  kind: 'new';
  order: number;
  isCover: boolean;
};

type BuildFinalImageSequenceParams = {
  title: string;
  existingImages: ExistingImagePayload[];
  uploadedImages: UploadedImage[];
  maxImages?: number;
};

/**
 * Combina imagens já existentes com novas, define ordem e capa,
 * e aplica fallback de alt quando necessário.
 */
export function buildFinalImageSequence({
  title,
  existingImages,
  uploadedImages,
  maxImages = 3,
}: BuildFinalImageSequenceParams): Array<FinalExistingImage | FinalNewImage> {
  const combined = [
    ...existingImages.map((image) => ({ kind: 'existing' as const, ...image })),
    ...uploadedImages.map((image) => ({ kind: 'new' as const, ...image })),
  ].slice(0, maxImages);

  return combined.map((image, index) => {
    const isCover = index === 0;
    const baseAlt =
      image.alt && image.alt.trim().length > 0
        ? image.alt
        : `${title} - foto ${index + 1}`;

    if (image.kind === 'existing') {
      return {
        ...image,
        kind: 'existing' as const,
        order: index,
        isCover,
        alt: baseAlt,
      };
    }

    return {
      ...image,
      kind: 'new' as const,
      order: index,
      isCover,
      alt: baseAlt,
    };
  });
}
