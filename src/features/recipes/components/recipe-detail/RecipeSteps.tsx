import { ScrollText } from 'lucide-react';

type Section = {
  name: string;
  modeOfPreparation: string;
};

type Props = {
  sections: Section[];
};

function splitSteps(text: string) {
  // Normaliza "\n" literal (ex: "1. A\\n2. B") para quebra real e cobre \r\n
  const normalized = text.replace(/\\n/g, '\n').replace(/\r\n/g, '\n');
  let parts = normalized
    .split('\n')
    .map((step) => step.trim())
    .filter(Boolean);
  // Fallback: AI retornou tudo em 1 linha tipo "1. A 2. B 3. C" colado com "\n2"
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
          {sections.reduce(
            (acc, s) => acc + splitSteps(s.modeOfPreparation).length,
            0,
          )}{' '}
          passos
        </span>
      </div>

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
                {steps.map((step, stepIndex) => (
                  <li
                    key={step}
                    className="grid grid-cols-[44px_1fr] gap-3 rounded-[14px] bg-white p-3 transition-colors hover:bg-[var(--muted)]"
                    style={{ border: '1px solid var(--line)' }}
                  >
                    <span
                      className="grid size-11 place-items-center rounded-full text-sm font-extrabold"
                      style={{
                        background: 'var(--food-accent)',
                        color: 'var(--cocoa)',
                      }}
                    >
                      {stepIndex + 1}
                    </span>
                    <p
                      className="pt-1 text-sm leading-6"
                      style={{ color: 'var(--cocoa)', textWrap: 'pretty' }}
                    >
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
