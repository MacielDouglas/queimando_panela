import { z } from 'zod';

export const sectionSchema = z.object({
  name: z.string().max(80, 'Nome da etapa muito longo').optional(),
  ingredientsText: z.string().min(1, 'Ingredientes obrigatórios'),
  modeOfPreparation: z.string().min(1, 'Modo de preparo obrigatório'),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, 'Título deve ter ao menos 3 caracteres'),
  story: z.string().max(500, 'Máximo 500 caracteres').optional(),
  sections: z.array(sectionSchema).min(1, 'Ao menos uma etapa obrigatória'),
  images: z.array(z.instanceof(File)).max(3, 'Máximo 3 imagens').optional(),
});

export type RecipeFormData = z.infer<typeof recipeFormSchema>;
