'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Save, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { recipeFormSchema } from '../../schemas/recipe.schema';
import {
  aiReviewSchema,
  type AiReviewFormData,
} from '../../schemas/recipe-ai-review-schema';
import { createRecipe } from '../../actions/create-recipe';
import { updateRecipe } from '../../actions/update-recipe';
import type { AiRecipeAnalysis } from '../../types/recipe-ai.types';

import { AiReviewPanel } from './AiReviewPanel';
import {
  ImageUploadField,
  type RecipeFormWithImages,
} from './fields/ImageUploadField';
import { SectionField } from './fields/SectionField';
import { StoryField } from './fields/StoryField';
import { TitleField } from './fields/TitleField';

type EditableRecipeImage = {
  id: string;
  key: string;
  url: string;
  alt: string;
  isCover: boolean;
  order: number;
};

type EditableRecipeData = {
  id: string;
  slug: string;
  title: string;
  story: string;
  summary: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  difficultyLabel: string;
  type: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: { nutrient: string; quantity: string }[];
  utensils: string[];
  sections: {
    name: string;
    ingredients: string[];
    modeOfPreparation: string;
  }[];
  images: EditableRecipeImage[];
};

type Props = {
  mode: 'create' | 'edit';
  initialData?: EditableRecipeData;
};

function aiAnalysisToFormData(data: AiRecipeAnalysis): AiReviewFormData {
  return {
    ...data,
    utensils: data.utensils.map((name) => ({ name })),
    sections: data.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients.map((text) => ({ text })),
    })),
  };
}

function formDataToAnalysis(data: AiReviewFormData): AiRecipeAnalysis {
  return {
    ...data,
    utensils: data.utensils.map((u) => u.name).filter(Boolean),
    sections: data.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients.map((i) => i.text).filter(Boolean),
    })),
  };
}

function editableRecipeToFormDefaults(
  initialData?: EditableRecipeData,
): RecipeFormWithImages {
  if (!initialData) {
    return {
      title: '',
      story: '',
      sections: [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
      images: [],
    };
  }

  return {
    title: initialData.title,
    story: initialData.story,
    sections:
      initialData.sections.length > 0
        ? initialData.sections.map((section) => ({
            name: section.name,
            ingredientsText: section.ingredients.join('\n'),
            modeOfPreparation: section.modeOfPreparation,
          }))
        : [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
    images:
      initialData.images?.map((image, index) => ({
        kind: 'existing' as const,
        id: image.id,
        key: image.key,
        url: image.url,
        alt: image.alt,
        isCover: image.isCover,
        order: image.order ?? index,
      })) ?? [],
  };
}

function editableRecipeToReviewDefaults(
  initialData?: EditableRecipeData,
): AiReviewFormData | undefined {
  if (!initialData) return undefined;

  return {
    title: initialData.title,
    summary: initialData.summary,
    difficulty: initialData.difficulty,
    difficultyLabel: initialData.difficultyLabel,
    type: initialData.type,
    prepTimeMinutes: initialData.prepTimeMinutes,
    cookTimeMinutes: initialData.cookTimeMinutes,
    suggestions: initialData.suggestions,
    nutritionSummary: initialData.nutritionSummary,
    nutritionPer100g: initialData.nutritionPer100g,
    utensils: initialData.utensils.map((name) => ({ name })),
    sections: initialData.sections.map((section) => ({
      name: section.name,
      modeOfPreparation: section.modeOfPreparation,
      ingredients: section.ingredients.map((text) => ({ text })),
    })),
  };
}

export function RecipeFormShell({ mode, initialData }: Props) {
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formDefaults = useMemo(
    () => editableRecipeToFormDefaults(initialData),
    [initialData],
  );

  const reviewDefaults = useMemo(
    () => editableRecipeToReviewDefaults(initialData),
    [initialData],
  );

  const hasReviewDefaults = Boolean(reviewDefaults);
  const [showReview, setShowReview] = useState(hasReviewDefaults);

  const form = useForm<RecipeFormWithImages>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: formDefaults,
  });

  const reviewForm = useForm<AiReviewFormData>({
    resolver: zodResolver(aiReviewSchema),
    defaultValues: reviewDefaults,
  });

  useEffect(() => {
    form.reset(formDefaults);
  }, [form, formDefaults]);

  useEffect(() => {
    if (reviewDefaults) {
      reviewForm.reset(reviewDefaults);
    }
  }, [reviewDefaults, reviewForm]);

  const isReviewVisible = showReview || hasReviewDefaults;
  const sections = useWatch({ control: form.control, name: 'sections' }) ?? [];

  const addSection = () => {
    form.setValue(
      'sections',
      [...sections, { name: '', ingredientsText: '', modeOfPreparation: '' }],
      { shouldDirty: true },
    );
  };

  const removeSection = (index: number) => {
    form.setValue(
      'sections',
      sections.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleAnalyze = async () => {
    const valid = await form.trigger(['title', 'sections']);
    if (!valid) return;

    const { title, sections: currentSections } = form.getValues();

    const normalizedSections = currentSections.map((section, index) => ({
      name:
        section.name?.trim() ||
        (index === 0 ? 'Receita' : `Etapa ${index + 1}`),
      ingredientsText: section.ingredientsText,
      modeOfPreparation: section.modeOfPreparation,
    }));

    setIsAnalyzing(true);
    setShowReview(false);
    setAiError(null);

    try {
      const response = await fetch('/api/recipes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sections: normalizedSections }),
      });

      const result = (await response.json()) as {
        data?: AiRecipeAnalysis;
        error?: string;
      };

      if (!response.ok || result.error) {
        setAiError(result.error ?? 'Falha ao analisar receita com IA.');
        return;
      }

      if (result.data) {
        reviewForm.reset(aiAnalysisToFormData(result.data));
        setShowReview(true);

        setTimeout(() => {
          document
            .getElementById('ai-review')
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('[RecipeFormShell] fetch error:', error);
      setAiError('Não foi possível analisar a receita agora.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    const valid = await reviewForm.trigger();
    if (!valid) return;

    setIsSaving(true);
    setAiError(null);

    try {
      const analysis = formDataToAnalysis(reviewForm.getValues());
      const story = form.getValues('story')?.trim() || '';
      const images = form.getValues('images') ?? [];

      const formData = new FormData();
      formData.set('analysis', JSON.stringify(analysis));
      formData.set('story', story);

      const existingImages = images
        .filter(
          (image): image is Extract<typeof image, { kind: 'existing' }> =>
            image.kind === 'existing',
        )
        .map((image) => ({
          id: image.id,
          key: image.key,
          url: image.url,
          alt: image.alt,
        }));

      formData.set('existingImages', JSON.stringify(existingImages));

      images.forEach((image) => {
        if (image.kind === 'new') {
          formData.append('images', image.file);
        }
      });

      const result =
        mode === 'edit' && initialData
          ? await updateRecipe(initialData.slug, formData)
          : await createRecipe(formData);

      if (result?.error) {
        setAiError(result.error);
      }
    } catch (error) {
      console.error('[RecipeFormShell] save error:', error);
      setAiError('Não foi possível salvar a receita agora.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6 border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8">
        <TitleField form={form} />
        <StoryField form={form} />
      </div>

      <section className="space-y-4 border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
          <h2 className="text-sm font-bold tracking-[0.16em] text-neutral-950 uppercase">
            {sections.length > 1 ? 'Etapas da receita' : 'Receita'}
          </h2>
        </div>

        {sections.map((_, index) => (
          <SectionField
            key={index}
            form={form}
            index={index}
            isOnly={sections.length === 1}
            onRemove={() => removeSection(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addSection}
          className="min-h-12 w-full border border-dashed border-amber-400 bg-white text-sm font-semibold text-amber-700 hover:bg-amber-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar etapa
        </Button>
      </section>

      <section className="border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8">
        <ImageUploadField form={form} />
      </section>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="min-h-12 border border-amber-500 bg-amber-500 px-5 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {mode === 'edit'
                ? 'Reanalisar receita com IA'
                : 'Analisar receita com IA'}
            </>
          )}
        </Button>

        {aiError && (
          <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {aiError}
          </p>
        )}
      </div>

      {isReviewVisible && (
        <section id="ai-review" className="space-y-5">
          <div className="border-b border-neutral-200 pb-3">
            <h2 className="text-sm font-bold tracking-[0.16em] text-neutral-950 uppercase">
              Revisão final
            </h2>
          </div>

          <AiReviewPanel form={reviewForm} />

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="min-h-12 w-full border border-neutral-900 bg-neutral-900 px-5 text-sm font-semibold text-white hover:border-amber-500 hover:bg-amber-500 hover:text-neutral-950"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'edit'
                  ? 'Salvando alterações...'
                  : 'Salvando receita...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === 'edit' ? 'Salvar alterações' : 'Salvar receita'}
              </>
            )}
          </Button>
        </section>
      )}
    </form>
  );
}
