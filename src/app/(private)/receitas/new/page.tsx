import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ChefHat } from 'lucide-react';
import { auth } from '@/lib/auth';
import { RecipeFormShell } from '@/features/recipes/components/recipe-form/RecipeFormShell';

export default async function NewRecipePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/login');

  return (
    <main className="relative overflow-hidden pb-32">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.08),transparent_50%)]"
      />

      <div className="editorial-container relative max-w-3xl pt-24">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            <ChefHat className="h-4 w-4" />
            Nova receita
          </div>

          <h1 className="text-5xl font-black tracking-tight text-neutral-900">
            Compartilhe sua receita
          </h1>

          <p className="max-w-lg text-lg leading-8 text-neutral-600">
            A IA vai revisar, corrigir e enriquecer sua receita antes de
            publicar. Você pode revisar tudo antes de salvar.
          </p>
        </div>

        <RecipeFormShell />
      </div>
    </main>
  );
}
