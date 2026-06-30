export type ExistingImagePayload = {
  readonly id: string;
  readonly key: string;
  readonly url: string;
  readonly alt: string;
};

export type UploadedImagePayload = {
  readonly key: string;
  readonly url: string;
  readonly alt: string;
  readonly contentType: string | null | undefined;
  readonly sizeBytes: number | null | undefined;
  readonly width: number | null | undefined;
  readonly height: number | null | undefined;
};

export type FinalExistingImage = ExistingImagePayload & {
  readonly kind: "existing";
  readonly order: number;
  readonly isCover: boolean;
};

export type FinalNewImage = UploadedImagePayload & {
  readonly kind: "new";
  readonly order: number;
  readonly isCover: boolean;
};

export type FinalImage = FinalExistingImage | FinalNewImage;

type BuildFinalImageSequenceParams = {
  title: string;
  existingImages: readonly ExistingImagePayload[];
  uploadedImages: readonly UploadedImagePayload[];
  maxImages?: number;
};

/**
 * Combina imagens existentes com novas, define ordem e capa,
 * aplica fallback de alt quando vazio, e limita ao máximo permitido.
 *
 * Regras:
 * - Existentes sempre vêm antes das novas (preserva a ordem original).
 * - O total é limitado a `maxImages` (padrão 3).
 * - index 0 é sempre a capa (isCover: true).
 * - alt vazio recebe fallback "título - foto N".
 */
export function buildFinalImageSequence({
  title,
  existingImages,
  uploadedImages,
  maxImages = 3,
}: BuildFinalImageSequenceParams): FinalImage[] {
  if (maxImages < 1) return [];

  const combined: Array<
    | { kind: "existing"; img: ExistingImagePayload }
    | { kind: "new"; img: UploadedImagePayload }
  > = [
    ...existingImages.map((img) => ({ kind: "existing" as const, img })),
    ...uploadedImages.map((img) => ({ kind: "new" as const, img })),
  ].slice(0, maxImages);

  return combined.map(({ kind, img }, index) => {
    const isCover = index === 0;
    const alt =
      img.alt && img.alt.trim().length > 0
        ? img.alt.trim()
        : `${title.trim()} - foto ${index + 1}`;

    if (kind === "existing") {
      return {
        ...(img as ExistingImagePayload),
        kind: "existing" as const,
        order: index,
        isCover,
        alt,
      } satisfies FinalExistingImage;
    }

    return {
      ...(img as UploadedImagePayload),
      kind: "new" as const,
      order: index,
      isCover,
      alt,
    } satisfies FinalNewImage;
  });
}
