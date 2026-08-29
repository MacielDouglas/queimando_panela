const values = [
  {
    title: 'Receitas com dono',
    description:
      'Toda receita mostra autor e história. Olhômetro vale tanto quanto gramas — a IA respeita o seu jeito.',
  },
  {
    title: 'Tradição que vive',
    description:
      'Do caderno amarelado para a tela. A IA confere e você decide o que fica — a memória continua sua.',
  },
  {
    title: 'Cozinha para todos',
    description:
      'Ingredientes do dia a dia, passos claros e tempo real. Cozinhar bem sem complicar.',
  },
];

export function ValuesSection() {
  return (
    <section
      className="py-[120px]"
      style={{ background: 'var(--forest)', color: 'white' }}
    >
      <div className="editorial-container">
        <div className="grid items-start gap-[clamp(38px,8vw,110px)] lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p
              className="eyebrow-queimando-panela"
              style={{ color: 'var(--accent-e)' }}
            >
              Nosso compromisso
            </p>
            <h2
              className="font-display text-[clamp(2.6rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-balance"
              style={{ color: 'white' }}
            >
              Menos artifícios. Mais sabor, origem e propósito.
            </h2>
            <div
              className="mt-5 h-[3px] w-12"
              style={{ background: 'var(--accent-e)' }}
              aria-hidden="true"
            />
            <p
              className="mt-6 max-w-[52ch] text-[1.08rem] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              Cada receita mostra autor, história e medidas de olhômetro
              validadas pela IA — você publica sabendo que vai dar certo.
            </p>
          </div>

          <div
            className="grid gap-0 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            {values.map((value) => (
              <article
                key={value.title}
                className="grid grid-cols-[1fr] gap-[8px] border-b py-[28px]"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div>
                  <h3
                    className="text-[1.22rem] font-bold leading-tight tracking-[-0.015em]"
                    style={{ color: 'white' }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="mt-2 max-w-[48ch] text-[0.96rem] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.72)' }}
                  >
                    {value.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
