import { ScrollText } from 'lucide-react';

type Section = {
  name: string;
  modeOfPreparation: string;
};

type Props = {
  sections: Section[];
};

function splitSteps(text: string) {
  return text
    .split('\n')
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => step.replace(/^\s*\d+[\.\)\-]?\s*/, ''));
}

export function RecipeSteps({ sections }: Props) {
  return (
    <section
      aria-labelledby="recipe-steps-heading"
      className="border border-neutral-200 bg-white p-5 sm:p-6 lg:p-8"
    >
      <div className="mb-6 flex items-center gap-2 border-b border-neutral-200 pb-3">
        <ScrollText className="h-4 w-4 text-amber-500" />
        <h2
          id="recipe-steps-heading"
          className="text-sm font-bold tracking-[0.16em] text-neutral-950 uppercase"
        >
          Modo de preparo
        </h2>
      </div>

      <div className="space-y-10">
        {sections.map((section, sectionIndex) => {
          const steps = splitSteps(section.modeOfPreparation);

          return (
            <section
              key={`${section.name}-${sectionIndex}`}
              className="space-y-5"
            >
              {sections.length > 1 && (
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  {section.name}
                </h3>
              )}

              <ol className="space-y-5">
                {steps.map((step, stepIndex) => (
                  <li
                    key={`${sectionIndex}-${stepIndex}`}
                    className="grid grid-cols-[36px_1fr] gap-4 sm:grid-cols-[44px_1fr]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center bg-amber-500 text-sm font-bold text-neutral-950 sm:h-11 sm:w-11">
                      {stepIndex + 1}
                    </span>

                    <p className="pt-1 text-sm leading-7 text-neutral-700 sm:text-base">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </section>
  );
}
