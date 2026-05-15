'use client';

import { useActionState, useMemo, useRef, useState, forwardRef, type ChangeEvent } from 'react';
import Link from 'next/link';
import { createRecipeAction } from '../actions/create-recipe';
import { updateRecipeAction } from '../actions/update-recipe';
import { IngredientsEditor } from './ingredients-editor';
import { UtensilsEditor } from './utensils-editor';
import { AiClassification } from './ai-classification';
import { SubmitButton } from './submit-button';
import { NutritionTable } from './NutritionTable';
import { slugify } from '@/lib/slugify';
import {
  type ParsedClassification,
  type ParsedIngredient,
  type ParsedUtensil,
  initialCreateRecipeState,
  initialUpdateRecipeState,
} from '../types/recipe-form.types';
import { useSpellCheck } from '../hooks/use-spell-check';
import { useRecipeGenerator } from '../hooks/use-recipe-generator';
import type { SpellCheckResult } from '@/server/ai/groq/spell-checker';
import type { NutritionRow } from '@/server/ai/groq/recipe-generator.types';
import { SpellCheckModal } from './spell-check-modal';
import { TypeSelector } from './type-selector';
import Image from 'next/image';

type RecipeImageFormData = {
  id: string;
  key: string;
  url: string;
  alt: string;
  contentType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  order: number;
  isCover: boolean;
  recipeId: string;
};

type RecipeFormInitialData = {
  id: string;
  title: string;
  summary: string | null;
  story: string | null;
  modeOfPreparation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  type: string;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  suggestions: string | null;
  notesAuthor: string | null;
  notesPublic: string | null;
  ingredients: ParsedIngredient[];
  utensils: ParsedUtensil[];
  images?: RecipeImageFormData[];
};

type RecipeFormProps = {
  mode?: 'create' | 'edit';
  initialData?: RecipeFormInitialData;
};

function withStableIds(items: ParsedIngredient[]): ParsedIngredient[] {
  return items.map((item, index) => ({
    ...item,
    id:
      item.id ??
      `${index}-${item.name?.trim().toLowerCase() ?? 'ingrediente'}-${item.originalText?.trim().toLowerCase() ?? 'sem-texto'}`,
  }));
}

const DIFFICULTY_LABEL: Record<'EASY' | 'MEDIUM' | 'HARD', string> = {
  EASY: 'Fácil',
  MEDIUM: 'Média',
  HARD: 'Difícil',
};

export function RecipeForm({ mode = 'create', initialData }: RecipeFormProps) {
  const isEdit = mode === 'edit';

  const [state, formAction] = useActionState(
    isEdit ? updateRecipeAction : createRecipeAction,
    isEdit ? initialUpdateRecipeState : initialCreateRecipeState,
  );

  const [modeOfPreparation, setModeOfPreparation] = useState(initialData?.modeOfPreparation ?? '');
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>(
    withStableIds(initialData?.ingredients ?? []),
  );
  const [utensils, setUtensils] = useState<ParsedUtensil[]>(initialData?.utensils ?? []);
  const [classification, setClassification] = useState<ParsedClassification | null>(null);
  const [recipeType, setRecipeType] = useState<string>(initialData?.type ?? '');
  const [typeSuggestions, setTypeSuggestions] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(
    initialData?.difficulty ?? 'MEDIUM',
  );
  const [nutritionTable, setNutritionTable] = useState<NutritionRow[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState('');
  const [removeCoverImage, setRemoveCoverImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const serializedIngredients = useMemo(() => JSON.stringify(ingredients), [ingredients]);
  const serializedUtensils = useMemo(() => JSON.stringify(utensils), [utensils]);
  const serializedNutritionTable = useMemo(() => JSON.stringify(nutritionTable), [nutritionTable]);

  const titleRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLTextAreaElement>(null);
  const cookTimeRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLTextAreaElement>(null);
  const notesAuthorRef = useRef<HTMLTextAreaElement>(null);
  const notesPublicRef = useRef<HTMLTextAreaElement>(null);

  const { isGenerating, error: generateError, generate } = useRecipeGenerator();
  const { isChecking, error: spellError, diffs, check, clear } = useSpellCheck();
  const [correctedData, setCorrectedData] = useState<SpellCheckResult | null>(null);

  const coverImage = useMemo(() => {
    return initialData?.images?.find((img) => img.isCover) ?? null;
  }, [initialData]);

  async function handleGenerateWithAi() {
    const title = titleRef.current?.value?.trim() ?? '';
    if (!title) {
      titleRef.current?.focus();
      return;
    }

    if (!modeOfPreparation.trim()) return;

    const result = await generate({ title, modeOfPreparation });
    if (!result) return;

    setModeOfPreparation(result.modeOfPreparation);

    if (summaryRef.current) summaryRef.current.value = result.summary;

    setIngredients(withStableIds(result.ingredients));
    setUtensils(result.utensils);
    setClassification(result.classification as ParsedClassification);

    if (result.classification.typeSuggestions.length > 0) {
      setTypeSuggestions(result.classification.typeSuggestions);
      if (!recipeType) setRecipeType(result.classification.typeSuggestions[0] ?? '');
    }

    if (result.difficulty) setDifficulty(result.difficulty);

    if (result.cookTimeMinutes && cookTimeRef.current) {
      cookTimeRef.current.value = String(result.cookTimeMinutes);
    }

    if (result.suggestions && suggestionsRef.current) {
      suggestionsRef.current.value = result.suggestions;
    }

    setNutritionTable(result.nutritionTable ?? []);
    setNutritionSummary(result.nutritionSummary ?? '');
  }

  async function handleSpellCheck() {
    const result = await check({
      title: titleRef.current?.value ?? '',
      summary: summaryRef.current?.value ?? '',
      story: storyRef.current?.value ?? '',
      modeOfPreparation,
      suggestions: suggestionsRef.current?.value ?? '',
      notesAuthor: notesAuthorRef.current?.value ?? '',
      notesPublic: notesPublicRef.current?.value ?? '',
    });

    if (result) setCorrectedData(result);
  }

  function handleApplyCorrections() {
    if (!correctedData) return;

    if (correctedData.title && titleRef.current) titleRef.current.value = correctedData.title;
    if (correctedData.summary && summaryRef.current) {
      summaryRef.current.value = correctedData.summary;
    }
    if (correctedData.story && storyRef.current) storyRef.current.value = correctedData.story;
    if (correctedData.modeOfPreparation) setModeOfPreparation(correctedData.modeOfPreparation);
    if (correctedData.suggestions && suggestionsRef.current) {
      suggestionsRef.current.value = correctedData.suggestions;
    }
    if (correctedData.notesAuthor && notesAuthorRef.current) {
      notesAuthorRef.current.value = correctedData.notesAuthor;
    }
    if (correctedData.notesPublic && notesPublicRef.current) {
      notesPublicRef.current.value = correctedData.notesPublic;
    }

    clear();
    setCorrectedData(null);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImagePreviewUrl(null);
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      alert('Envie PNG, JPG ou WebP.');
      event.target.value = '';
      setImagePreviewUrl(null);
      return;
    }

    if (file.size > maxBytes) {
      alert('A imagem deve ter no máximo 5 MB.');
      event.target.value = '';
      setImagePreviewUrl(null);
      return;
    }

    setRemoveCoverImage(false);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  }

  const showCurrentCover = !removeCoverImage && !imagePreviewUrl && !!coverImage;

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(28,25,23,0.05)]"
    >
      {isEdit && initialData && <input type="hidden" name="recipeId" value={initialData.id} />}
      <input type="hidden" name="removeCoverImage" value={removeCoverImage ? 'true' : 'false'} />

      <div className="border-b border-stone-200 px-5 py-5 md:px-8">
        <h2 className="text-lg font-semibold text-stone-900">
          {isEdit ? 'Editar receita' : 'Nova receita'}
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Preencha o título e o modo de preparo, depois clique em <strong>Gerar com IA</strong> para
          preencher os demais campos automaticamente.
        </p>
      </div>

      <div className="grid gap-8 px-5 py-6 md:px-8">
        <section className="space-y-4 rounded-xl border-2 border-amber-200 bg-amber-50/40 px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-amber-800">✨ Entrada para a IA</p>
              <p className="mt-0.5 text-xs text-amber-700">
                Preencha o título e o modo de preparo. A IA irá sugerir todos os outros campos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateWithAi}
              disabled={isGenerating}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? 'Gerando…' : 'Gerar com IA'}
            </button>
          </div>

          <Field label="Título" htmlFor="title">
            <FormInput
              ref={titleRef}
              id="title"
              name="title"
              required
              placeholder="Ex: Broa de Fubá da Vovó"
              defaultValue={initialData?.title}
            />
          </Field>

          <div className="space-y-1.5">
            <label htmlFor="modeOfPreparation" className="text-sm font-medium text-stone-800">
              Modo de preparo
            </label>
            <p className="text-xs text-stone-500">
              Escreva livremente — a IA irá formatar, corrigir e extrair todas as informações.
            </p>
            <FormTextarea
              id="modeOfPreparation"
              name="modeOfPreparation"
              rows={10}
              required
              value={modeOfPreparation}
              onChange={(e) => setModeOfPreparation(e.target.value)}
              placeholder="Em um recipiente, coloque 2 xícaras de fubá..."
            />
          </div>

          {generateError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generateError}
            </p>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Campos sugeridos pela IA
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <Field label="Resumo" htmlFor="summary">
            <FormInput
              ref={summaryRef}
              id="summary"
              name="summary"
              placeholder="A IA irá gerar um resumo apetitoso…"
              defaultValue={initialData?.summary ?? ''}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Dificuldade" htmlFor="difficulty">
              <FormSelect
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
              >
                <option value="EASY">{DIFFICULTY_LABEL.EASY}</option>
                <option value="MEDIUM">{DIFFICULTY_LABEL.MEDIUM}</option>
                <option value="HARD">{DIFFICULTY_LABEL.HARD}</option>
              </FormSelect>
            </Field>

            <Field label="Tipo" htmlFor="type">
              {typeSuggestions.length > 0 && (
                <p className="mb-1 text-xs text-amber-600">✨ Sugerido pela IA</p>
              )}
              <TypeSelector
                value={recipeType}
                suggestions={typeSuggestions}
                onChange={setRecipeType}
              />
            </Field>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Preparo (min)" htmlFor="prepTimeMinutes">
                <FormInput
                  id="prepTimeMinutes"
                  name="prepTimeMinutes"
                  type="number"
                  min={0}
                  defaultValue={initialData?.prepTimeMinutes ?? ''}
                />
              </Field>

              <Field label="Forno (min)" htmlFor="cookTimeMinutes">
                <FormInput
                  ref={cookTimeRef}
                  id="cookTimeMinutes"
                  name="cookTimeMinutes"
                  type="number"
                  min={0}
                  defaultValue={initialData?.cookTimeMinutes ?? ''}
                />
              </Field>

              <Field label="Porções" htmlFor="servings">
                <FormInput
                  id="servings"
                  name="servings"
                  type="number"
                  min={1}
                  defaultValue={initialData?.servings ?? ''}
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-stone-900">Ingredientes sugeridos</h3>
                <p className="text-sm text-stone-600">Revise e ajuste antes de salvar.</p>
              </div>
              <IngredientsEditor ingredients={ingredients} onChange={setIngredients} />
            </section>

            <div className="space-y-6">
              <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-stone-900">Utensílios</h3>
                  <p className="text-sm text-stone-600">Deduzidos a partir do preparo.</p>
                </div>
                <UtensilsEditor utensils={utensils} onChange={setUtensils} />
              </section>

              <section className="rounded-xl border border-stone-200 bg-white px-4 py-4">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-stone-900">Classificação sugerida</h3>
                  <p className="text-sm text-stone-600">Apoio editorial para revisar.</p>
                </div>
                <div className="mt-4">
                  <AiClassification classification={classification} />
                </div>
              </section>
            </div>
          </div>

          {nutritionTable.length > 0 && (
            <NutritionTable rows={nutritionTable} summary={nutritionSummary} />
          )}

          <Field label="Sugestões" htmlFor="suggestions">
            <FormTextarea
              ref={suggestionsRef}
              id="suggestions"
              name="suggestions"
              rows={3}
              placeholder="A IA irá sugerir substituições, acompanhamentos e variações…"
              defaultValue={initialData?.suggestions ?? ''}
            />
          </Field>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Campos manuais
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <Field label="História" htmlFor="story">
            <FormTextarea
              ref={storyRef}
              id="story"
              name="story"
              rows={3}
              placeholder="Conte a origem da receita, memórias ou contexto."
              defaultValue={initialData?.story ?? ''}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Notas do autor" htmlFor="notesAuthor">
              <FormTextarea
                ref={notesAuthorRef}
                id="notesAuthor"
                name="notesAuthor"
                rows={3}
                placeholder="Notas internas, ajustes e observações."
                defaultValue={initialData?.notesAuthor ?? ''}
              />
            </Field>

            <Field label="Notas públicas" htmlFor="notesPublic">
              <FormTextarea
                ref={notesPublicRef}
                id="notesPublic"
                name="notesPublic"
                rows={3}
                placeholder="Observações visíveis para os leitores."
                defaultValue={initialData?.notesPublic ?? ''}
              />
            </Field>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-900">Imagem da receita</h3>
            <p className="text-sm text-stone-600">
              Aceita qualquer imagem. O arquivo será convertido para WebP e otimizado para até 3 MB.
            </p>
          </div>

          {showCurrentCover && coverImage && (
            <div className="space-y-3">
              <div className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-xl border border-stone-200 bg-white">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={removeCoverImage}
                  onChange={(e) => setRemoveCoverImage(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                Remover imagem atual
              </label>
            </div>
          )}

          {imagePreviewUrl && (
            <div className="space-y-2">
              <div className="relative aspect-4/3 w-full max-w-md overflow-hidden rounded-xl border border-stone-200 bg-white">
                <Image
                  src={imagePreviewUrl}
                  alt="Pré-visualização da nova imagem"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>
              <p className="text-xs text-stone-500">Nova imagem selecionada.</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-stone-800">
              {isEdit ? 'Trocar imagem' : 'Enviar imagem'}
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 file:mr-4 file:rounded-md file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-amber-900 hover:file:bg-amber-200"
            />
          </div>
        </section>

        <input type="hidden" name="aiIngredients" value={serializedIngredients} />
        <input type="hidden" name="aiUtensils" value={serializedUtensils} />
        <input type="hidden" name="nutritionTable" value={serializedNutritionTable} />
        <input type="hidden" name="nutritionSummary" value={nutritionSummary} />
        <input type="hidden" name="type" value={recipeType} />

        {state.status === 'error' && state.message && (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href={isEdit && initialData ? `/receitas/${slugify(initialData.title)}` : '/receitas'}
            className="inline-flex items-center justify-center rounded-md border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Cancelar
          </Link>

          <button
            type="button"
            onClick={handleSpellCheck}
            disabled={isChecking}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking ? 'Revisando…' : 'Revisar texto'}
          </button>

          <SubmitButton label={isEdit ? 'Salvar alterações' : 'Salvar receita'} />
        </div>

        {spellError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {spellError}
          </p>
        )}

        {diffs && (
          <SpellCheckModal
            diffs={diffs}
            onApply={handleApplyCorrections}
            onClose={() => {
              clear();
              setCorrectedData(null);
            }}
          />
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      {children}
    </div>
  );
}

const FormInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
    />
  ),
);
FormInput.displayName = 'FormInput';

const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => (
  <textarea
    ref={ref}
    {...props}
    className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
  />
));
FormTextarea.displayName = 'FormTextarea';

function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition focus:border-amber-500 focus:ring-amber-500"
    />
  );
}
