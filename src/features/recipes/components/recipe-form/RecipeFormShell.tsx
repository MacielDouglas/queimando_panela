'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { createRecipe } from '../../actions/create-recipe';
import { updateRecipe } from '../../actions/update-recipe';
import { recipeFormSchema } from '../../schemas/recipe.schema';
import {
  type AiReviewFormData,
  aiReviewSchema,
} from '../../schemas/recipe-ai-review-schema';
import type { AiRecipeAnalysis } from '../../types/recipe-ai.types';
import { AiReviewPanel } from './AiReviewPanel';
import {
  ImageUploadField,
  type RecipeFormWithImages,
} from './fields/ImageUploadField';
import { StoryField } from './fields/StoryField';
import { TitleField } from './fields/TitleField';
import {
  RecipeFormAnalyzeAction,
  RecipeFormSaveAction,
} from './RecipeFormActions';
import { RecipeFormSections } from './RecipeFormSections';
import {
  aiAnalysisToFormData,
  type EditableRecipeData,
  editableRecipeToFormDefaults,
  editableRecipeToReviewDefaults,
  formDataToAnalysis,
} from './recipe-form-mappers';

type Props = {
  mode: 'create' | 'edit';
  initialData?: EditableRecipeData;
};

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
    if (reviewDefaults) reviewForm.reset(reviewDefaults);
  }, [reviewDefaults, reviewForm]);

  const isReviewVisible = showReview || hasReviewDefaults;
  const sections = useWatch({ control: form.control, name: 'sections' }) ?? [];

  const addSection = () => {
    form.setValue(
      'sections',
      [
        ...sections,
        {
          id: crypto.randomUUID(),
          name: '',
          ingredientsText: '',
          modeOfPreparation: '',
        },
      ],
      { shouldDirty: true },
    );
  };

  const removeSection = (index: number) => {
    form.setValue(
      'sections',
      sections.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
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
        setTimeout(
          () =>
            document
              .getElementById('ai-review')
              ?.scrollIntoView({ behavior: 'smooth' }),
          100,
        );
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
        if (image.kind === 'new') formData.append('images', image.file);
      });
      const result =
        mode === 'edit' && initialData
          ? await updateRecipe(initialData.slug, formData)
          : await createRecipe(formData);
      if (result?.error) setAiError(result.error);
    } catch (error) {
      console.error('[RecipeFormShell] save error:', error);
      setAiError('Não foi possível salvar a receita agora.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div
        className="space-y-6 bg-white p-5 sm:p-7 lg:p-8"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)',
        }}
      >
        <TitleField form={form} />
        <StoryField form={form} />
      </div>

      <RecipeFormSections
        form={form}
        onAdd={addSection}
        onRemove={removeSection}
      />

      <section
        className="bg-white p-5 sm:p-7 lg:p-8"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--line)',
        }}
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
            Fotos
          </h2>
        </div>
        <div className="mt-4">
          <ImageUploadField form={form} />
        </div>
        <p
          className="mt-3 font-sans text-xs leading-5"
          style={{ color: 'var(--ink-muted)' }}
        >
          Arraste ou clique para enviar. A primeira foto vira capa. Até 3
          imagens.
        </p>
      </section>

      <RecipeFormAnalyzeAction
        isAnalyzing={isAnalyzing}
        mode={mode}
        onAnalyze={handleAnalyze}
        aiError={aiError}
      />

      {isReviewVisible && (
        <section id="ai-review" className="space-y-5">
          <div
            className="pb-4"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-1 w-8"
                style={{ background: 'var(--ai-primary)' }}
                aria-hidden="true"
              />
              <h2
                className="font-display text-sm font-extrabold uppercase"
                style={{ letterSpacing: '0.1em', color: 'var(--cocoa)' }}
              >
                Revisão final
              </h2>
            </div>
            <p
              className="mt-2 max-w-[65ch] font-sans text-sm leading-6"
              style={{ color: 'var(--ink-muted)' }}
            >
              Revise a análise da IA. Tudo aqui é editável — publique só quando
              estiver do seu jeito.
            </p>
          </div>

          <AiReviewPanel form={reviewForm} />

          <RecipeFormSaveAction
            isSaving={isSaving}
            mode={mode}
            onSave={handleSave}
          />
        </section>
      )}
    </form>
  );
}
