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
    .map((step) => step.replace(/^\s*\d+[.)-]?\s*/, ''));
}

export function RecipeSteps({ sections }: Props) {
  return (
    <section className="border-2 border-[#0a0a0a] bg-white">
      <div className="border-b-2 border-[#0a0a0a] bg-[#0a0a0a] px-4 py-3 flex items-center gap-2">
        <ScrollText className="size-4 text-[#ffb900]" />
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.14em] text-white">
          Modo de preparo
        </h2>
      </div>

      <div className="p-4 sm:p-6 space-y-8">
        {sections.map((section) => {
          const steps = splitSteps(section.modeOfPreparation);
          return (
            <section key={section.name} className="space-y-4">
              {sections.length > 1 && (
                <h3 className="inline-block bg-[#ffb900] border-2 border-[#0a0a0a] px-3 py-1 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
                  {section.name}
                </h3>
              )}
              <ol className="space-y-3">
                {steps.map((step, stepIndex) => (
                  <li
                    key={step}
                    className="grid grid-cols-[44px_1fr] gap-3 border border-[#e5e5e5] bg-[#f5f5f5] p-3 hover:border-[#0a0a0a] hover:bg-white"
                  >
                    <span className="grid size-11 place-items-center border-2 border-[#0a0a0a] bg-[#ffb900] font-display text-sm font-extrabold text-[#0a0a0a]">
                      {stepIndex + 1}
                    </span>
                    <p className="pt-1 font-sans text-sm leading-6 text-[#0a0a0a]">
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
