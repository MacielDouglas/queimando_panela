"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  createRecipeAction,
} from "../actions/create-recipe";
import { IngredientsEditor } from "./ingredients-editor";
import { UtensilsEditor } from "./utensils-editor";
import { AiClassification } from "./ai-classification";
import { SubmitButton } from "./submit-button";
import {
  type ParsedClassification,
  type ParsedIngredient,
  type ParseRecipeResponse,
  type ParsedUtensil,
  initialCreateRecipeState,
} from "../types/recipe-form.types";

export function RecipeForm() {
  const [state, formAction] = useActionState(
    createRecipeAction,
    initialCreateRecipeState,
  );

  const [modeOfPreparation, setModeOfPreparation] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>([]);
  const [utensils, setUtensils] = useState<ParsedUtensil[]>([]);
  const [classification, setClassification] =
    useState<ParsedClassification | null>(null);

  const serializedIngredients = useMemo(
    () => JSON.stringify(ingredients),
    [ingredients],
  );

  const serializedUtensils = useMemo(
    () => JSON.stringify(utensils),
    [utensils],
  );

  async function handleParseWithAi() {
    setParseError(null);

    if (!modeOfPreparation.trim()) {
      setParseError("Escreva o modo de preparo antes de usar a IA.");
      return;
    }

    setIsParsing(true);

    try {
      const response = await fetch("/api/recipes/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modeOfPreparation }),
      });

      if (!response.ok) throw new Error("Erro ao analisar.");

      const data = (await response.json()) as ParseRecipeResponse;

      setIngredients(data.ingredients ?? []);
      setUtensils(data.utensils ?? []);
      setClassification(data.classification ?? null);
    } catch {
      setParseError("Não foi possível analisar a receita com IA agora.");
    } finally {
      setIsParsing(false);
    }
  }

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_10px_30px_rgba(28,25,23,0.05)]"
    >
      {/* Cabeçalho */}
      <div className="border-b border-stone-200 px-5 py-5 md:px-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Base da receita
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Preencha as informações e use a IA para sugerir ingredientes e
          utensílios.
        </p>
      </div>

      <div className="grid gap-8 px-5 py-6 md:px-8">
        {/* Título e Resumo */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Título" htmlFor="title">
            <FormInput
              id="title"
              name="title"
              required
              placeholder="Bolo de banana da manhã"
            />
          </Field>

          <Field label="Resumo" htmlFor="summary">
            <FormInput
              id="summary"
              name="summary"
              placeholder="Receita caseira, macia e perfeita para o café."
            />
          </Field>
        </div>

        {/* História */}
        <Field label="História" htmlFor="story">
          <FormTextarea
            id="story"
            name="story"
            rows={3}
            placeholder="Conte a origem da receita, memórias ou contexto."
          />
        </Field>

        {/* Dificuldade, Tipo e Tempos */}
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Dificuldade" htmlFor="difficulty">
            <FormSelect id="difficulty" name="difficulty" defaultValue="MEDIUM">
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Média</option>
              <option value="HARD">Difícil</option>
            </FormSelect>
          </Field>

          <Field label="Tipo" htmlFor="type">
            <FormSelect id="type" name="type" defaultValue="OTHER">
              <option value="SWEET">Doce</option>
              <option value="SAVORY">Salgada</option>
              <option value="DRINK">Bebida</option>
              <option value="OTHER">Outro</option>
            </FormSelect>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Preparo (min)" htmlFor="prepTimeMinutes">
              <FormInput
                id="prepTimeMinutes"
                name="prepTimeMinutes"
                type="number"
                min={0}
              />
            </Field>
            <Field label="Forno (min)" htmlFor="cookTimeMinutes">
              <FormInput
                id="cookTimeMinutes"
                name="cookTimeMinutes"
                type="number"
                min={0}
              />
            </Field>
            <Field label="Porções" htmlFor="servings">
              <FormInput
                id="servings"
                name="servings"
                type="number"
                min={1}
              />
            </Field>
          </div>
        </div>

        {/* Modo de preparo + IA */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <label
                htmlFor="modeOfPreparation"
                className="text-sm font-medium text-stone-800"
              >
                Modo de preparo
              </label>
              <p className="mt-0.5 text-xs text-stone-500">
                Escreva livremente; a IA vai sugerir ingredientes, utensílios e
                classificação.
              </p>
            </div>

            <button
              type="button"
              onClick={handleParseWithAi}
              disabled={isParsing}
              className="shrink-0 inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isParsing ? "Analisando..." : "Gerar com IA"}
            </button>
          </div>

          <FormTextarea
            id="modeOfPreparation"
            name="modeOfPreparation"
            rows={8}
            required
            value={modeOfPreparation}
            onChange={(e) => setModeOfPreparation(e.target.value)}
            placeholder={"1. Bata os ovos com o açúcar...\n2. Acrescente a farinha...\n3. Leve ao forno..."}
          />
        </div>

        {/* Erros de parse IA */}
        {parseError && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {parseError}
          </p>
        )}

        {/* Erro da action */}
        {state.status === "error" && state.message && (
          <p
            role="alert"
            aria-live="assertive"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {state.message}
          </p>
        )}

        {/* Ingredientes e Utensílios */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-stone-900">
                Ingredientes sugeridos
              </h3>
              <p className="text-sm text-stone-600">
                Revise e ajuste antes de salvar.
              </p>
            </div>
            <IngredientsEditor
              ingredients={ingredients}
              onChange={setIngredients}
            />
          </section>

          <div className="space-y-6">
            <section className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-stone-900">
                  Utensílios
                </h3>
                <p className="text-sm text-stone-600">
                  Deduzidos a partir do preparo.
                </p>
              </div>
              <UtensilsEditor utensils={utensils} onChange={setUtensils} />
            </section>

            <section className="rounded-xl border border-stone-200 bg-white px-4 py-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-stone-900">
                  Classificação sugerida
                </h3>
                <p className="text-sm text-stone-600">
                  Apoio editorial para revisar.
                </p>
              </div>
              <div className="mt-4">
                <AiClassification classification={classification} />
              </div>
            </section>
          </div>
        </div>

        {/* Notas */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Sugestões" htmlFor="suggestions">
            <FormTextarea
              id="suggestions"
              name="suggestions"
              rows={3}
              placeholder="Substituições, acompanhamentos e variações."
            />
          </Field>

          <Field label="Notas do autor" htmlFor="notesAuthor">
            <FormTextarea
              id="notesAuthor"
              name="notesAuthor"
              rows={3}
              placeholder="Notas internas, ajustes e observações."
            />
          </Field>
        </div>

        <Field label="Notas públicas" htmlFor="notesPublic">
          <FormTextarea
            id="notesPublic"
            name="notesPublic"
            rows={3}
            placeholder="Observações visíveis para os leitores."
          />
        </Field>

        {/* Hidden fields para dados da IA */}
        <input
          type="hidden"
          name="aiIngredients"
          value={serializedIngredients}
        />
        <input
          type="hidden"
          name="aiUtensils"
          value={serializedUtensils}
        />

        {/* Ações */}
        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Cancelar
          </Link>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

// ─── Primitivos de UI (sem "use client" extra, vivem dentro do mesmo módulo) ──

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

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
    />
  );
}

function FormTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition placeholder:text-stone-400 focus:border-amber-500 focus:ring-amber-500"
    />
  );
}

function FormSelect(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select
      {...props}
      className="block w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-2 ring-transparent transition focus:border-amber-500 focus:ring-amber-500"
    />
  );
}