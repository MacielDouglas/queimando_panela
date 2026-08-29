const values = [
  {
    title: 'Receitas de família',
    description:
      'Pratos que passam de geração em geração, guardando memórias e sabores.',
  },
  {
    title: 'Tradição viva',
    description: 'Cada receita é um pedaço de história que merece ser contada.',
  },
  {
    title: 'Gastronomia acessível',
    description:
      'Criamos soluções versáteis para transformar o cotidiano em uma experiência mais saborosa.',
  },
];

export function ValuesSection() {
  return (
    <section
      className="py-[100px]"
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
              className="font-display text-[clamp(2.4rem,4.8vw,4rem)] font-bold leading-[1.05] tracking-[-0.045em]"
              style={{ color: 'white' }}
            >
              Menos artifícios. Mais sabor, origem e propósito.
            </h2>
            <p
              className="mt-6 text-[1.04rem]"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              A boa comida cria conexões. Por isso, cada escolha parte de uma
              ideia simples: saboreie as tortas salgadas, o orgulho da culinária
              caseira. Aproveite o café da manhã, uma fonte atemporal de
              energia.
            </p>
          </div>

          <div
            className="grid gap-0 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.2)' }}
          >
            {values.map((value) => (
              <article
                key={value.title}
                className="grid grid-cols-[1fr] gap-[6px] border-b py-[25px]"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div>
                  <h3
                    className="text-[1.05rem] font-semibold"
                    style={{ color: 'white' }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className="mt-[7px] text-[0.92rem]"
                    style={{ color: 'rgba(255,255,255,0.68)' }}
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
