import type { Metadata } from 'next';
import { RecipeForm } from '@/features/recipes/components/recipe-form';

export const metadata: Metadata = {
  title: 'Nova receita | Queimando Panela',
};

export default function NewRecipePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12">
        <header className="mb-8 space-y-3">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-700">
            Caderno de receitas
          </span>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
              Nova receita
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-stone-600 md:text-base">
              Escreva o modo de preparo livremente e deixe a IA sugerir ingredientes, utensílios e
              classificações para acelerar o cadastro.
            </p>
          </div>
        </header>

        <RecipeForm />
      </section>
    </main>
  );
}
