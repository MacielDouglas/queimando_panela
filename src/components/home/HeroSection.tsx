import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1920&q=80"
        alt="Mesa de cozinha com ingredientes frescos e caderno de receitas"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="absolute inset-0 flex items-end">
        <div className="editorial-container pb-16 lg:pb-24">
          <div className="max-w-[700px]">
            <p className="inline-flex items-center gap-2 bg-[#ffb900] px-3 py-1.5 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
              <span
                className="size-1.5 rounded-full bg-[#0a0a0a]"
                aria-hidden
              />
              Queimando Panela
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,1.5rem+3vw,4.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-white text-wrap-balance">
              Receitas caseiras
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">que são memória</span>
                <span
                  className="absolute inset-x-0 bottom-[0.1em] h-[0.4em] bg-[#ffb900]/80"
                  aria-hidden
                />
              </span>
            </h1>
            <p className="mt-5 max-w-[52ch] font-sans text-lg leading-7 text-white/80 text-wrap-pretty">
              Descubra, guarde e compartilhe receitas de família. Histórias que
              merecem ser lembradas, direto da cozinha de quem faz com carinho.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/receitas"
                className="inline-flex min-h-14 items-center rounded-none bg-[#ffb900] px-8 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Explorar receitas
              </Link>
              <Link
                href="/receitas/new"
                className="inline-flex min-h-14 items-center rounded-none border-2 border-white/30 bg-white/10 px-8 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Enviar receita
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
