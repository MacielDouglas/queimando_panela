'use client';

import { Check, ScrollText } from 'lucide-react';
import { useState } from 'react';

type Section = {
  name: string;
  modeOfPreparation: string;
};

type Props = {
  sections: Section[];
};

function splitSteps(text: string) {
  const normalized = text.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  let parts = normalized
    .split('\n')
    .map((step) => step.trim())
    .filter(Boolean);
  if (parts.length === 1 && /\s\d+\.\s/.test(parts[0])) {
    const fallback = parts[0]
      .split(/\s(?=\d+\.\s)/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (fallback.length > 1) parts = fallback;
  }
  return parts.map((step) => step.replace(/^\s*\d+[.)-]?\s*/, ''));
}

export function RecipeSteps({ sections }: Props) {
  const allSteps = sections.flatMap((s) =>
    splitSteps(s.modeOfPreparation).map((_, i) => `${s.name}-${i}`),
  );
  const total = allSteps.length;
  const [done, setDone] = useState<Set<string>>(() => new Set());

  const toggle = (key: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const progress = total ? Math.round((done.size / total) * 100) : 0;
  const allDone = total > 0 && done.size === total;

  return (
    <section
      className="qp-card-delight overflow-hidden bg-white"
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--line)',
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-4"
        style={{
          borderBottom: '1px solid var(--line)',
          background: 'var(--cocoa)',
          color: 'white',
        }}
      >
        <ScrollText
          className="size-4"
          style={{ color: 'var(--food-accent)' }}
        />
        <h2
          className="text-[0.78rem] font-bold uppercase"
          style={{ color: 'white', letterSpacing: '0.08em' }}
        >
          Modo de preparo
        </h2>
        <span
          className="ml-auto text-xs"
          style={{ color: 'rgba(255,255,255,0.72)' }}
        >
          {done.size}/{total} passos
        </span>
      </div>

      {/* progress delight */}
      <div className="h-1 w-full bg-[var(--muted)]" aria-hidden="true">
        <div
          className="h-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            width: `${progress}%`,
            background: 'var(--food-accent)',
          }}
        />
      </div>

      {allDone && (
        <div
          className="mx-5 mt-4 rounded-full px-3 py-2 text-center text-xs font-bold animate-[qp-bounce_600ms_cubic-bezier(0.25,1,0.5,1)]"
          style={{
            background: 'var(--food-accent)',
            color: 'var(--cocoa)',
          }}
          role="status"
          aria-live="polite"
        >
          Panela dominada! Você arrasou — sirva com orgulho ✨
        </div>
      )}

      <div className="space-y-8 p-5 sm:p-6">
        {sections.map((section) => {
          const steps = splitSteps(section.modeOfPreparation);
          return (
            <section key={section.name} className="space-y-4">
              {sections.length > 1 && (
                <h3
                  className="inline-flex rounded-full px-3 py-1 text-[0.78rem] font-bold uppercase"
                  style={{
                    background: 'var(--food-accent)',
                    color: 'var(--cocoa)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {section.name}
                </h3>
              )}
              <ol className="space-y-3">
                {steps.map((step, stepIndex) => {
                  const key = `${section.name}-${stepIndex}`;
                  const isDone = done.has(key);
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        aria-pressed={isDone}
                        onClick={() => toggle(key)}
                        className="group grid w-full grid-cols-[44px_1fr] gap-3 rounded-[14px] bg-white p-3 text-left transition-colors hover:bg-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                        style={{
                          border: '1px solid var(--line)',
                          background: isDone ? 'var(--muted)' : 'white',
                          opacity: isDone ? 0.9 : 1,
                        }}
                      >
                        <span
                          className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-extrabold transition-all duration-200"
                          style={{
                            background: isDone
                              ? 'var(--cocoa)'
                              : 'var(--food-accent)',
                            color: isDone ? 'white' : 'var(--cocoa)',
                            transform: isDone ? 'scale(0.95)' : 'scale(1)',
                          }}
                          aria-hidden="true"
                        >
                          {isDone ? (
                            <Check className="size-4" />
                          ) : (
                            stepIndex + 1
                          )}
                        </span>
                        <p
                          className="pt-1 text-sm leading-6 transition-colors"
                          style={{
                            color: isDone ? 'var(--ink-muted)' : 'var(--cocoa)',
                            textDecorationLine: isDone
                              ? 'line-through'
                              : 'none',
                            textDecorationColor: 'var(--food-accent)',
                            textDecorationThickness: '2px',
                            textWrap: 'pretty',
                          }}
                        >
                          {step}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <style>{`@keyframes qp-bounce { 0% { transform: scale(0.96); opacity: 0 } 60% { transform: scale(1.02); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }`}</style>
    </section>
  );
}
