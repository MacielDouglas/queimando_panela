import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    name: 'Prato principal',
    description:
      'Arroz, feijoada, moqueca — pratos que sustentam a mesa e a conversa.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
    href: '/receitas?categoria=Prato%20principal',
  },
  {
    name: 'Sobremesa',
    description: 'Bolo, pudim, doce de avó — finais doces que viram história.',
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
    href: '/receitas?categoria=Sobremesa',
  },
  {
    name: 'Café da manhã',
    description: 'Pão, tapioca, café passado — começos que dão energia ao dia.',
    image:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',
    href: '/receitas?categoria=Caf%C3%A9%20da%20manh%C3%A3',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-29">
      <div className="editorial-container">
        <div className="flex items-end justify-between gap-8">
          <div>
            <h2 className="section-title-queimando-panela">
              Sabores que inspiram a sua próxima receita.
            </h2>
          </div>
        </div>

        <div className="mt-13 grid gap-5.5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.name}
              className="group overflow-hidden border bg-white transition-[transform,box-shadow]"
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
                  style={{ color: 'var(--forest)' }}
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
                >
                  Ver receitas
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
