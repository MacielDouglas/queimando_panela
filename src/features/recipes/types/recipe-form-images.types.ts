export type ExistingRecipeImageInput = {
  kind: 'existing';
  id: string;
  key: string;
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
};

export type NewRecipeImageInput = {
  kind: 'new';
  file: File;
  previewUrl: string;
  isCover: boolean;
  order: number;
};

export type RecipeImageInput = ExistingRecipeImageInput | NewRecipeImageInput;
