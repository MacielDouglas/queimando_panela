import Image from 'next/image';

export function IntroSection() {
  return (
    <section
      className="qp-reveal py-24 lg:py-28"
      style={{ background: 'var(--cream)' }}
    >
      <div className="editorial-container">
        <div className="grid items-center gap-[clamp(38px,9vw,120px)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 'var(--radius-lg)' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f1e9] lg:aspect-[1/1.06]">
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
              className="relative mt-4 max-w-[230px] p-5 lg:absolute lg:bottom-[34px] lg:right-[-28px] lg:mt-0"
              style={{
                borderRadius: '14px',
                background: 'var(--cocoa)',
                color: 'white',
                boxShadow: 'var(--shadow)',
              }}
            >
              <strong
                className="block font-display text-[1.55rem] font-bold"
                style={{ color: 'var(--food-accent)' }}
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
            <h2 className="section-title-queimando-panela">
              Cozinha caseira, com medida de olhômetro e de grama.
            </h2>
            <p className="section-copy">
              Mostre quem fez, de onde veio e como acertar de primeira. A IA
              sugere utensílios, calcula nutrição e estima tempo — sem tirar o
              sabor da sua história.
            </p>
            <p className="section-copy">
              Você testa em casa, revisa o rascunho da IA e publica com
              confiança.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
