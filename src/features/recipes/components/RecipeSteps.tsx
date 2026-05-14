type Props = { modeOfPreparation: string };

export function RecipeSteps({ modeOfPreparation }: Props) {
  const isNumbered = /^\d+\./.test(modeOfPreparation.trim());

  const steps = modeOfPreparation
    .split(/\n/)
    .map((l) => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  return (
    <section>
      <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-stone-400">
        Modo de preparo
      </h2>
      {isNumbered ? (
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-stone-700">{step}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700">
          {modeOfPreparation}
        </p>
      )}
    </section>
  );
}
