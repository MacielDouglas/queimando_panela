import Image from 'next/image';
import Link from 'next/link';

export function IntroSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="editorial-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[12px]">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"
                alt="Ingredientes frescos e temperos tradicionais"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
                Sabores que contam histórias
              </p>
            </div>
          </div>

          <div className="max-w-[520px]">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[#6b6b6b]">
              Queimando Panela
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,1.2rem+2vw,2.8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-[#0a0a0a] text-wrap-balance">
              Descubra os segredos
              <br />
              da cozinha caseira
            </h2>
            <p className="mt-5 max-w-[48ch] font-sans text-[15px] leading-7 text-[#6b6b6b] text-wrap-pretty">
              Escondidos nos sabores mais genuínos, nas receitas que passam de
              geração em geração. Cada prato carrega uma história, cada tempero
              uma memória.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/receitas"
                className="group inline-flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-[#0a0a0a]"
              >
                Ver receitas
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-[#0a0a0a] transition-colors group-hover:bg-[#ffb900]">
                  <span className="text-[#0a0a0a]">→</span>
                </span>
              </Link>
              <span className="h-px w-16 bg-[#e5e5e5]" aria-hidden />
              <p className="font-sans text-xs leading-5 text-[#6b6b6b]">
                Receitas testadas
                <br />
                na cozinha de casa
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
