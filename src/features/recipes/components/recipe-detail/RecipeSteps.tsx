type Section = {
  name: string;
  modeOfPreparation: string;
};

type Props = {
  sections: Section[];
  story: string | null;
};

export function RecipeSteps({ sections, story }: Props) {
  const cleanStepText = (text: string) =>
    text.replace(/^\s*\d+[\.\)\-]?\s*/, '');
  return (
    <div className="space-y-10">
      {story && (
        <div className="rounded-3xl border-l-4 border-amber-400 bg-amber-50/60 px-6 py-5">
          <p className="mb-1 text-xs font-semibold tracking-widest text-amber-600 uppercase">
            História
          </p>
          <p className="text-sm leading-relaxed text-neutral-700">{story}</p>
        </div>
      )}

      {sections.map((section, si) => (
        <div key={si} className="space-y-6">
          {sections.length > 1 && (
            <h3 className="text-xl font-black text-neutral-900">
              {section.name}
            </h3>
          )}

          {sections.length === 1 && (
            <h3 className="text-xs font-semibold tracking-widest text-neutral-500 uppercase">
              Modo de preparo
            </h3>
          )}

          <ol className="space-y-5">
            {section.modeOfPreparation
              .split('\n')
              .filter(Boolean)
              .map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-neutral-700">
                    {cleanStepText(step)}
                  </p>
                </li>
              ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
