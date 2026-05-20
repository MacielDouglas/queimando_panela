'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Save, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  recipeFormSchema,
  type RecipeFormData,
} from '../../schemas/recipe.schema';
// import { analyzeRecipe } from '../../actions/analyze-recipe';
import { createRecipe } from '../../actions/create-recipe';
import type { AiRecipeAnalysis } from '../../types/recipe-ai.types';

import { AiReviewPanel } from './AiReviewPanel';
import { ImageUploadField } from './fields/ImageUploadField';
import { SectionField } from './fields/SectionField';
import { StoryField } from './fields/StoryField';
import { TitleField } from './fields/TitleField';

export function RecipeFormShell() {
  const [aiResult, setAiResult] = useState<AiRecipeAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      story: '',
      sections: [{ name: '', ingredientsText: '', modeOfPreparation: '' }],
      images: [],
    },
  });

  const sections =
    useWatch({
      control: form.control,
      name: 'sections',
    }) ?? [];

  const addSection = () => {
    form.setValue('sections', [
      ...sections,
      { name: '', ingredientsText: '', modeOfPreparation: '' },
    ]);
  };

  const removeSection = (index: number) => {
    form.setValue(
      'sections',
      sections.filter((_, i) => i !== index),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleAnalyze = async () => {
    console.log('[RecipeFormShell] handleAnalyze CLICK');

    const valid = await form.trigger(['title', 'sections']);
    console.log('[RecipeFormShell] form valid?', valid);

    if (!valid) {
      console.log('[RecipeFormShell] errors:', form.formState.errors);
      return;
    }

    const { title, sections: currentSections } = form.getValues();

    const normalizedSections = currentSections.map((s, i) => ({
      name: s.name?.trim() || (i === 0 ? 'Receita' : `Etapa ${i + 1}`),
      ingredientsText: s.ingredientsText,
      modeOfPreparation: s.modeOfPreparation,
    }));

    console.log('[RecipeFormShell] values:', { title, normalizedSections });

    setIsAnalyzing(true);
    setAiResult(null);
    setAiError(null);

    try {
      const response = await fetch('/api/recipes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sections: normalizedSections,
        }),
      });

      console.log('[RecipeFormShell] fetch status:', response.status);

      const result = (await response.json()) as {
        data?: AiRecipeAnalysis;
        error?: string;
      };

      console.log('[RecipeFormShell] fetch result:', result);

      if (!response.ok || result.error) {
        setAiError(result.error ?? 'Falha ao analisar receita com IA.');
        return;
      }

      setAiResult(result.data ?? null);

      setTimeout(() => {
        document
          .getElementById('ai-review')
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('[RecipeFormShell] fetch error:', error);
      setAiError('Não foi possível analisar a receita agora.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!aiResult) return;

    setIsSaving(true);

    const story = form.getValues('story') ?? undefined;
    const result = await createRecipe(aiResult, story);

    setIsSaving(false);

    if (result?.error) {
      setAiError(result.error);
    }
  };

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TitleField form={form} />

      <StoryField form={form} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-neutral-900">
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
          className="w-full rounded-2xl border-dashed border-amber-300 py-5 text-amber-700 hover:border-amber-400 hover:bg-amber-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar outra etapa
        </Button>
      </div>

      <ImageUploadField form={form} />

      <Button
        type="button"
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="w-full rounded-full bg-amber-500 py-6 text-base font-bold text-neutral-900 shadow-lg shadow-amber-500/20 hover:bg-amber-400"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analisando com IA...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Analisar receita com IA
          </>
        )}
      </Button>

      {aiError && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {aiError}
        </p>
      )}

      {aiResult && (
        <div id="ai-review" className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-black text-neutral-900">
              Resultado da análise — revise antes de salvar
            </h2>
          </div>

          <AiReviewPanel data={aiResult} />

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-full bg-neutral-900 py-6 text-base font-bold text-white hover:bg-neutral-800"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Salvando receita...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Salvar receita
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
