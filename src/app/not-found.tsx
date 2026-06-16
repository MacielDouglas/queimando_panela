import Image from 'next/image';
import Link from 'next/link';
import { TbError404 } from 'react-icons/tb';

export default function NotFound() {
  return (
    <main className="h-screen bg-taupe-900 md:grid md:grid-cols-2">
      <div className="relative h-full">
        <Image
          src="/cooking_fire.webp"
          alt="Cozinha com fogo"
          fill
          className="object-cover"
          priority
        />
      </div>
      <section className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-black/50 p-8 md:relative md:bg-transparent">
        <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
          <TbError404 className="size-60 text-stone-300" />
          <h1 className="text-3xl font-bold text-stone-50 md:text-stone-500">
            Opa! Esse cheirinho não tava no cardápio…
          </h1>
          <p className="text-stone-400 md:text-stone-600">
            Acho que a panela passou do ponto! Vamos voltar para a página
            principal!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-amber-500 px-8 py-4 text-sm font-bold text-neutral-900 transition-all duration-200 hover:scale-[1.02] hover:bg-amber-400"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </main>
  );
}
