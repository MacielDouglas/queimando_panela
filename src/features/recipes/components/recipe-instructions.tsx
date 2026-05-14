type Props = { text: string };

export function RecipeInstructions({ text }: Props) {
  // Detecta se está em formato de lista numerada (começa com "1.")
  const isNumbered = /^\d+\./.test(text.trim());

  if (isNumbered) {
    const steps = text
      .split(/\n/)
      .map((l) => l.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);

    return (
      <section>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">Modo de preparo</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-stone-700">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-stone-900">Modo de preparo</h2>
      <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700">{text}</p>
    </section>
  );
}
