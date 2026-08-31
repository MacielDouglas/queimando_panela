'use client';

import {
  Beef,
  Bot,
  ChefHat,
  Cookie,
  Copy,
  Egg,
  HelpCircle,
  Refrigerator,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Preference = 'doce' | 'salgado' | 'tanto_faz';
type Recipe = {
  title: string;
  summary: string;
  difficulty: string;
  difficultyLabel: string;
  types: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number | null;
  suggestions: string;
  nutritionSummary: string;
  nutritionPer100g: { nutrient: string; quantity: string }[];
  utensils: string[];
  sections: {
    name: string;
    ingredients: { originalText: string; name: string; generalName: string }[];
    modeOfPreparation: string;
  }[];
};

function splitSuggestions(text: string) {
  const normalized = text.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  return normalized
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitSteps(text: string) {
  const normalized = text.replace(/\\n/g, '\n');
  let parts = normalized
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 1 && /\s\d+\.\s/.test(parts[0])) {
    const fb = parts[0]
      .split(/\s(?=\d+\.\s)/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (fb.length > 1) parts = fb;
  }
  return parts.map((s) => s.replace(/^\s*\d+[.)-]?\s*/, ''));
}

export function GeladeiraClient({ isLogged }: { isLogged: boolean }) {
  const router = useRouter();
  const [chips, setChips] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [pref, setPref] = useState<Preference>('tanto_faz');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const addChip = (value: string) => {
    const v = value.trim().toLowerCase();
    if (!v || chips.includes(v)) return;
    if (chips.length >= 30) return;
    setChips([...chips, v]);
    setInput('');
  };

  const removeChip = (idx: number) =>
    setChips(chips.filter((_, i) => i !== idx));

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const parts = input
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length > 1) {
        for (const p of parts) addChip(p);
      } else if (input.trim()) {
        addChip(input);
      }
    }
    if (e.key === 'Backspace' && !input && chips.length) {
      removeChip(chips.length - 1);
    }
  };

  const canGenerate = chips.length > 0 && !loading;

  const generate = async (withAnswers?: boolean[]) => {
    setError(null);
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        ingredients: chips,
        preference: pref,
      };
      if (withAnswers && questions.length) {
        payload.answers = questions.map((q, i) => ({
          question: q,
          answer: withAnswers[i] ?? false,
        }));
      } else if (answers.length && questions.length && !withAnswers) {
        payload.answers = questions.map((q, i) => ({
          question: q,
          answer: answers[i] ?? false,
        }));
      }

      const res = await fetch('/api/geladeira/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? 'Erro ao gerar receita');
      }
      if (json.status === 'needs_info') {
        setQuestions(json.questions);
        setAnswers(json.questions.map(() => false));
        setRecipe(null);
      } else if (json.status === 'ready') {
        setRecipe(json.recipe);
        setQuestions([]);
        setAnswers([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (idx: number, value: boolean) => {
    const next = [...answers];
    next[idx] = value;
    setAnswers(next);
  };

  const copyRecipe = async () => {
    if (!recipe) return;
    const lines: string[] = [];
    lines.push(`# ${recipe.title}`);
    lines.push('');
    lines.push(recipe.summary);
    lines.push('');
    lines.push(
      `Dificuldade: ${recipe.difficultyLabel} | Preparo: ${recipe.prepTimeMinutes}min | Cozimento: ${recipe.cookTimeMinutes}min`,
    );
    lines.push('');
    for (const sec of recipe.sections) {
      lines.push(`## ${sec.name}`);
      lines.push('');
      lines.push('Ingredientes:');
      for (const ing of sec.ingredients) lines.push(`- ${ing.originalText}`);
      lines.push('');
      lines.push('Modo de preparo:');
      const steps = splitSteps(sec.modeOfPreparation);
      for (const [i, s] of steps.entries()) lines.push(`${i + 1}. ${s}`);
      lines.push('');
    }
    if (recipe.suggestions) {
      lines.push('Sugestões:');
      for (const p of splitSuggestions(recipe.suggestions))
        lines.push(`- ${p}`);
    }
    const text = lines.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const publishRecipe = async () => {
    if (!recipe) return;
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch('/api/geladeira/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Erro ao publicar');
      router.push(`/receitas/${json.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-dvh pb-12" style={{ background: 'transparent' }}>
      {/* Hero divertido — pattern igual à Home */}
      <section
        className="relative overflow-hidden border-b bg-transparent"
        style={{ borderColor: 'var(--line)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, var(--cocoa) 1.2px, transparent 1.5px), radial-gradient(circle at 80% 60%, var(--food-accent) 1.2px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        <div className="editorial-container relative py-10 lg:py-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-[640px]">
              <p
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-bold uppercase"
                style={{
                  borderColor: 'var(--line)',
                  color: 'var(--cocoa)',
                  letterSpacing: '0.08em',
                }}
              >
                <Refrigerator
                  className="size-3.5"
                  style={{ color: 'var(--cocoa)' }}
                  aria-hidden="true"
                />
                O que tem?
                <span className="hidden sm:inline">
                  {' '}
                  — o que tem em casa vira receita
                </span>
              </p>
              <h1
                className="mt-4 font-display text-[clamp(2.4rem,6vw,3.8rem)] font-extrabold leading-[0.9] tracking-[-0.04em]"
                style={{ color: 'var(--cocoa)' }}
              >
                O que tem?
              </h1>
              <p
                className="mt-4 max-w-[52ch] text-[1.02rem] leading-6"
                style={{ color: 'var(--ink-muted)' }}
              >
                Jogue os ingredientes na panela virtual, escolha <b>doce</b>,{' '}
                <b>salgado</b> ou <b>tanto faz</b> e deixe a IA fuçar sua
                geladeira. Se faltar algo essencial, ela faz até 2 perguntinhas
                rápidas.
              </p>
              <p className="mt-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
                Até 3 criações por 24h (janela deslizante) — válido apenas
                logado. Depois do limite, respire e volte amanhã!
              </p>
            </div>
            <div
              className="hidden lg:grid size-[220px] place-items-center rounded-full border-[10px] bg-white text-center shadow-sm"
              style={{ borderColor: 'var(--paper)', transform: 'rotate(6deg)' }}
              aria-hidden="true"
            >
              <ChefHat
                className="size-10"
                style={{ color: 'var(--cocoa)' }}
                aria-hidden="true"
              />
              <span
                className="mt-2 block text-xs font-bold uppercase tracking-[0.08em]"
                style={{ color: 'var(--cocoa)' }}
              >
                IA cozinheira
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-container py-8">
        {/* Card de entrada */}
        <div
          className="overflow-hidden bg-white"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="flex items-center gap-2 px-5 py-4"
            style={{ borderBottom: '1px solid var(--line)' }}
          >
            <span
              className="grid size-8 place-items-center rounded-full"
              style={{
                background: 'var(--food-accent)',
                color: 'var(--cocoa)',
              }}
            >
              <Egg className="size-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-bold" style={{ color: 'var(--cocoa)' }}>
              O que você tem?
            </h2>
            <span
              className="ml-auto text-xs"
              style={{ color: 'var(--ink-muted)' }}
            >
              {chips.length}/30
            </span>
          </div>

          <div className="p-5 space-y-5">
            {!isLogged && (
              <div
                className="rounded-[12px] border bg-[var(--muted)] px-4 py-3 text-sm"
                style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
                role="alert"
              >
                Você pode ver a página, mas só quem está logado pode gerar
                receitas.{' '}
                <Link
                  href="/sign-in"
                  className="font-bold underline decoration-[var(--food-accent)] underline-offset-4"
                >
                  Entrar
                </Link>{' '}
                ou{' '}
                <Link
                  href="/criar-conta"
                  className="font-bold underline decoration-[var(--food-accent)] underline-offset-4"
                >
                  criar conta
                </Link>
                .
              </div>
            )}

            {/* Chips input */}
            <div>
              <label
                htmlFor="geladeira-input"
                className="text-xs font-bold uppercase tracking-[0.08em]"
                style={{ color: 'var(--cocoa)' }}
              >
                Ingredientes
              </label>
              <div
                className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-[12px] border bg-white px-3 py-2 focus-within:ring-2"
                style={{ borderColor: 'var(--line)' }}
              >
                {chips.map((chip, i) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      background: 'var(--food-accent)',
                      color: 'var(--cocoa)',
                    }}
                  >
                    {chip}
                    <button
                      type="button"
                      aria-label={`Remover ${chip}`}
                      onClick={() => removeChip(i)}
                      className="grid size-5 place-items-center rounded-full bg-white/70 text-xs hover:bg-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="geladeira-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={
                    chips.length
                      ? 'Outro ingrediente + Enter'
                      : 'Ex: ovos, manjericão, tomate...'
                  }
                  className="min-w-[160px] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-[var(--ink-muted)]"
                  autoComplete="off"
                />
              </div>
              <p
                className="mt-1.5 text-xs"
                style={{ color: 'var(--ink-muted)' }}
              >
                Digite e aperte <b>Enter</b> ou <b>,</b>. Ex: ovos, manjericão.
              </p>
            </div>

            {/* Preferência */}
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.08em]"
                style={{ color: 'var(--cocoa)' }}
              >
                Você quer algo...
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { v: 'salgado', label: 'Salgado', Icon: Beef },
                    { v: 'doce', label: 'Doce', Icon: Cookie },
                    { v: 'tanto_faz', label: 'Tanto faz', Icon: Sparkles },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setPref(opt.v)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-[12px] border px-3 py-3 text-sm font-bold transition-colors"
                    style={{
                      borderColor:
                        pref === opt.v ? 'var(--food-accent)' : 'var(--line)',
                      background:
                        pref === opt.v ? 'var(--food-accent)' : 'white',
                      color: 'var(--cocoa)',
                    }}
                    aria-pressed={pref === opt.v}
                  >
                    <opt.Icon className="size-4" aria-hidden="true" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                className="rounded-[12px] border px-3 py-2 text-sm"
                style={{
                  background: '#fff1f1',
                  borderColor: '#e5a0a0',
                  color: '#7a1a1a',
                }}
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => generate()}
                disabled={!canGenerate || !isLogged}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-extrabold uppercase tracking-[0.06em] transition-colors disabled:opacity-50"
                style={{ background: 'var(--cocoa)', color: 'white' }}
              >
                {loading ? (
                  'Fuçando a geladeira...'
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    Gerar receita{' '}
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChips([]);
                  setInput('');
                  setQuestions([]);
                  setAnswers([]);
                  setRecipe(null);
                  setError(null);
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-full border bg-white px-5 text-sm font-bold"
                style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
              >
                Limpar
              </button>
            </div>

            {!isLogged && (
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                Dica: faça login para liberar o botão de gerar. A validação é no
                backend por usuário (3/24h).
              </p>
            )}
          </div>
        </div>

        {/* Perguntas inline (chat) */}
        {questions.length > 0 && !recipe && (
          <div
            className="mt-6 overflow-hidden bg-white"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
            }}
          >
            <div
              className="px-5 py-4"
              style={{
                borderBottom: '1px solid var(--line)',
                background: 'var(--muted)',
              }}
            >
              <h3
                className="inline-flex items-center gap-2 text-sm font-bold"
                style={{ color: 'var(--cocoa)' }}
              >
                <HelpCircle className="size-4" aria-hidden="true" />A IA precisa
                de uma ajudinha
              </h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
                Responda com Sim ou Não. Até 2 perguntinhas, bem rápidas.
              </p>
            </div>
            <div className="space-y-4 p-5">
              {questions.map((q, i) => (
                <div
                  key={q}
                  className="rounded-[12px] border bg-white p-4"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    {q}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(i, true)}
                      className="rounded-full px-4 py-2 text-sm font-bold"
                      style={{
                        background:
                          answers[i] === true ? 'var(--food-accent)' : 'white',
                        border: '1px solid var(--line)',
                        color: 'var(--cocoa)',
                      }}
                      aria-pressed={answers[i] === true}
                    >
                      Sim, tenho
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswerChange(i, false)}
                      className="rounded-full px-4 py-2 text-sm font-bold"
                      style={{
                        background:
                          answers[i] === false && answers[i] !== undefined
                            ? 'var(--cocoa)'
                            : 'white',
                        border: '1px solid var(--line)',
                        color:
                          answers[i] === false && answers[i] !== undefined
                            ? 'white'
                            : 'var(--cocoa)',
                      }}
                      aria-pressed={answers[i] === false}
                    >
                      Não tenho
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => generate(answers)}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-extrabold disabled:opacity-50"
                style={{ background: 'var(--cocoa)', color: 'white' }}
              >
                {loading ? (
                  'Gerando...'
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    Gerar com minhas respostas{' '}
                    <Sparkles className="size-4" aria-hidden="true" />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Receita divertida */}
        {recipe && (
          <section className="mt-8 space-y-6">
            <div
              className="overflow-hidden bg-white"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                className="relative p-6 lg:p-8"
                style={{ background: 'var(--food-accent)' }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    background:
                      'radial-gradient(circle at 18% 22%, var(--cocoa) 0 1.2px, transparent 1.5px), radial-gradient(circle at 78% 72%, var(--cocoa) 0 1.2px, transparent 1.5px)',
                    backgroundSize: '22px 22px',
                  }}
                  aria-hidden="true"
                />
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]"
                  style={{
                    color: 'var(--cocoa)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <Bot className="size-3.5" aria-hidden="true" /> Criada por IA
                  com o que tinha em casa
                </span>
                <h2
                  className="mt-3 max-w-[18ch] font-display text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[0.9] tracking-[-0.04em]"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {recipe.title}
                </h2>
                <p
                  className="mt-3 max-w-[60ch] text-[1.02rem] leading-6"
                  style={{ color: 'rgba(27,41,32,0.78)', textWrap: 'pretty' }}
                >
                  {recipe.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.types.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase"
                      style={{
                        border: '1px solid var(--line)',
                        color: 'var(--cocoa)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  <span
                    className="rounded-full bg-[var(--cocoa)] px-3 py-1 text-xs font-bold uppercase"
                    style={{ color: 'white' }}
                  >
                    {recipe.difficultyLabel} •{' '}
                    {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
                  </span>
                </div>
              </div>

              <div className="grid gap-6 p-6 lg:grid-cols-[1.05fr_1.6fr]">
                <div
                  className="rounded-[12px] border bg-[var(--muted)] p-4"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-[0.08em]"
                    style={{ color: 'var(--cocoa)' }}
                  >
                    Ingredientes
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {recipe.sections
                      .flatMap((s) => s.ingredients)
                      .map((ing) => (
                        <li
                          key={ing.originalText}
                          className="rounded-[10px] bg-white px-3 py-2 text-sm"
                          style={{
                            border: '1px solid var(--line)',
                            color: 'var(--cocoa)',
                          }}
                        >
                          {ing.originalText}
                        </li>
                      ))}
                  </ul>
                  {recipe.utensils.length > 0 && (
                    <div className="mt-4">
                      <h4
                        className="text-xs font-bold uppercase tracking-[0.08em]"
                        style={{ color: 'var(--cocoa)' }}
                      >
                        Utensílios
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipe.utensils.map((u) => (
                          <span
                            key={u}
                            className="rounded-full bg-white px-2.5 py-1 text-xs font-bold"
                            style={{ border: '1px solid var(--line)' }}
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {recipe.sections.map((sec) => (
                    <section
                      key={sec.name}
                      className="rounded-[12px] border bg-white p-4"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <h3
                        className="text-sm font-bold"
                        style={{ color: 'var(--cocoa)' }}
                      >
                        {sec.name}
                      </h3>
                      <ol className="mt-2 space-y-2">
                        {splitSteps(sec.modeOfPreparation).map((step, idx) => (
                          <li
                            key={`${sec.name}-${step.slice(0, 24)}`}
                            className="flex gap-3 text-sm leading-6"
                            style={{ color: 'var(--cocoa)' }}
                          >
                            <span
                              className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold"
                              style={{
                                background: 'var(--food-accent)',
                                color: 'var(--cocoa)',
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>
                  ))}

                  {recipe.suggestions && (
                    <div
                      className="rounded-[12px] border bg-white p-4"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <h4
                        className="text-xs font-bold uppercase tracking-[0.08em]"
                        style={{ color: 'var(--cocoa)' }}
                      >
                        Dicas da IA
                      </h4>
                      <div className="mt-2 space-y-2">
                        {splitSuggestions(recipe.suggestions).map((p) => (
                          <p
                            key={p.slice(0, 32)}
                            className="text-sm leading-6"
                            style={{ color: 'var(--ink-muted)' }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="flex flex-wrap gap-3 border-t bg-white px-6 py-4"
                style={{ borderColor: 'var(--line)' }}
              >
                <button
                  type="button"
                  onClick={copyRecipe}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border bg-white px-5 text-sm font-bold"
                  style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
                >
                  {copied ? (
                    'Copiado! ✓'
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      Copiar receita{' '}
                      <Copy className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={publishRecipe}
                  disabled={publishing || !isLogged}
                  className="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-extrabold disabled:opacity-50"
                  style={{ background: 'var(--cocoa)', color: 'white' }}
                >
                  {publishing ? (
                    'Publicando...'
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      Publicar como receita{' '}
                      <Bot className="size-4" aria-hidden="true" />
                    </span>
                  )}
                </button>
                {!isLogged && (
                  <span
                    className="self-center text-xs"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    Faça login para publicar
                  </span>
                )}
              </div>
              <p
                className="px-6 pb-4 text-center text-xs"
                style={{ color: 'var(--ink-muted)' }}
              >
                Ao publicar, ficará claro que esta receita foi{' '}
                <b>criada por IA</b> a partir do que você tinha em casa. Você
                poderá editar depois.
              </p>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
