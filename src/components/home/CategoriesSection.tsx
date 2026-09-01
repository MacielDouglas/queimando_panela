import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Prato principal',
    description:
      'Arroz, feijoada, moqueca — pratos que sustentam a mesa e a conversa.',
    image: '/images/prato-principal.jpg',
    href: '/receitas?categoria=Prato%20principal',
    cta: 'Ver pratos principais',
  },
  {
    name: 'Sobremesa',
    description: 'Bolo, pudim, doce de avó — finais doces que viram história.',
    image: '/images/sobremesa.jpg',
    href: '/receitas?categoria=Sobremesa',
    cta: 'Ver sobremesas',
  },
  {
    name: 'Café da manhã',
    description: 'Pão, tapioca, café passado — começos que dão energia ao dia.',
    image: '/images/cafe-manha.jpg',
    href: '/receitas?categoria=Caf%C3%A9%20da%20manh%C3%A3',
    cta: 'Ver cafés da manhã',
  },
];

export function CategoriesSection() {
  return (
    <section className="qp-reveal py-24 lg:py-28">
      <div className="editorial-container">
        <div className="flex items-end justify-between gap-8">
          <div>
            <h2 className="section-title-queimando-panela">
              Sabores que inspiram a sua próxima receita.
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.name}
              className="qp-card-delight group overflow-hidden border bg-white"
              style={{
                borderColor: 'var(--line)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '1.2 / 1' }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3
                  className="font-display text-[1.72rem] font-bold tracking-[-0.03em]"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {category.name}
                </h3>
                <p
                  className="mt-3 text-[0.94rem]"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  {category.description}
                </p>
                <Link
                  href={category.href}
                  className="text-link-queimando-panela mt-5 inline-flex"
                  aria-label={`${category.cta} — ${category.name}`}
                >
                  {category.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
