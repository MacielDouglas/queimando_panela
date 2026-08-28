import Image from 'next/image';

export function IntroSection() {
  return (
    <section className="py-[110px]" style={{ background: 'var(--white)' }}>
      <div className="editorial-container">
        <div className="grid items-center gap-[clamp(38px,9vw,120px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="relative aspect-[1/1.06] overflow-hidden bg-[#f5f0e8]">
                <Image
                  src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1000&q=85"
                  alt="Queijos artesanais, ervas e ingredientes naturais"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div
              className="absolute bottom-[34px] right-[-28px] max-w-[230px] p-5"
              style={{
                borderRadius: '14px',
                background: 'var(--forest)',
                color: 'white',
                boxShadow: 'var(--shadow)',
              }}
            >
              <strong
                className="block font-display text-[1.55rem] font-bold"
                style={{ color: 'var(--accent-e)' }}
              >
                Sabores que contam histórias
              </strong>
              <span
                className="mt-1 block text-[0.84rem]"
                style={{ color: 'rgba(255,255,255,0.78)' }}
              >
                Um cuidado que você percebe no aroma, na textura e no sabor.
              </span>
            </div>
          </div>

          <div className="max-w-[520px]">
            <p className="eyebrow-queimando-panela">Queimando Panela</p>
            <h2 className="section-title-epirus">
              Descubra os segredos da cozinha caseira.
            </h2>
            <p className="section-copy">
              Escondidos nos sabores mais genuínos, nas receitas que passam de
              geração em geração. Cada prato carrega uma história, cada tempero
              uma memória
            </p>
            <p className="section-copy">
              Receitas testadas na cozinha de casa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
