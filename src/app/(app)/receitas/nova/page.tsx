import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/get-server-session';
import { slugify } from '@/lib/slugify';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Nova receita | Queimando Panela',
};

async function createRecipe(formData: FormData) {
  'use server';

  const session = await getServerSession();

  const user = session?.user as { id?: string | null } | null;

  if (!user?.id) {
    redirect('/login');
  }

  const title = String(formData.get('title') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim() || null;
  const story = String(formData.get('story') ?? '').trim() || null;
  const modeOfPreparation = String(formData.get('modeOfPreparation') ?? '').trim();
  const suggestions = String(formData.get('suggestions') ?? '').trim() || null;
  const notesAuthor = String(formData.get('notesAuthor') ?? '').trim() || null;
  const notesPublic = String(formData.get('notesPublic') ?? '').trim() || null;

  const difficulty = String(formData.get('difficulty') ?? 'MEDIUM');
  const type = String(formData.get('type') ?? 'OTHER');

  const prepTimeMinutesRaw = String(formData.get('prepTimeMinutes') ?? '');
  const cookTimeMinutesRaw = String(formData.get('cookTimeMinutes') ?? '');
  const servingsRaw = String(formData.get('servings') ?? '');

  if (!title) {
    // em produção podemos evoluir para useFormState; por enquanto, fallback simples
    throw new Error('Título é obrigatório.');
  }

  if (!modeOfPreparation) {
    throw new Error('Modo de preparo é obrigatório.');
  }

  const prepTimeMinutes = prepTimeMinutesRaw ? Number(prepTimeMinutesRaw) : null;
  const cookTimeMinutes = cookTimeMinutesRaw ? Number(cookTimeMinutesRaw) : null;
  const servings = servingsRaw ? Number(servingsRaw) : null;

  const slug = slugify(title);

  await prisma.recipe.create({
    data: {
      title,
      slug,
      summary,
      story,
      difficulty: difficulty as any, // ajuste para o enum do Prisma (RecipeDifficulty)
      type: type as any, // ajuste para RecipeType
      modeOfPreparation,
      suggestions,
      notesAuthor,
      notesPublic,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      authorId: user.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  // Futuro: redirecionar para /receitas/[slug]
  redirect('/');
}

export default async function NewRecipePage() {
  // (app)/layout.tsx já garante que o usuário está autenticado,
  // então aqui não precisamos checar sessão de novo.
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Nova receita</h1>
        <p className="text-sm text-neutral-700">
          Preencha os detalhes da receita. O modo de preparo será usado depois pela IA para sugerir
          ingredientes e utensílios.
        </p>
      </header>

      <form
        action={createRecipe}
        className="grid gap-6 rounded-lg border border-neutral-200 bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-900">
              Título
            </label>
            <input
              id="title"
              name="title"
              required
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              placeholder="Bolo de fubá cremoso"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="summary" className="block text-sm font-medium text-neutral-900">
              Resumo
            </label>
            <input
              id="summary"
              name="summary"
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              placeholder="Um bolo de fubá cremoso, fácil e perfeito para o café."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="difficulty" className="block text-sm font-medium text-neutral-900">
              Dificuldade
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue="MEDIUM"
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
            >
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Média</option>
              <option value="HARD">Difícil</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="type" className="block text-sm font-medium text-neutral-900">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              defaultValue="SWEET"
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
            >
              <option value="SWEET">Doce</option>
              <option value="SAVORY">Salgada</option>
              <option value="DRINK">Bebida</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label
                htmlFor="prepTimeMinutes"
                className="block text-xs font-medium text-neutral-900"
              >
                Preparo (min)
              </label>
              <input
                id="prepTimeMinutes"
                name="prepTimeMinutes"
                type="number"
                min={0}
                className="block w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="cookTimeMinutes"
                className="block text-xs font-medium text-neutral-900"
              >
                Forno/fogo (min)
              </label>
              <input
                id="cookTimeMinutes"
                name="cookTimeMinutes"
                type="number"
                min={0}
                className="block w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="servings" className="block text-xs font-medium text-neutral-900">
                Porções
              </label>
              <input
                id="servings"
                name="servings"
                type="number"
                min={1}
                className="block w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-xs outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="story" className="block text-sm font-medium text-neutral-900">
            História (opcional)
          </label>
          <textarea
            id="story"
            name="story"
            rows={3}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
            placeholder="Conte a história dessa receita, de onde veio, memórias, etc."
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="modeOfPreparation" className="block text-sm font-medium text-neutral-900">
            Modo de preparo
          </label>
          <textarea
            id="modeOfPreparation"
            name="modeOfPreparation"
            rows={6}
            required
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
            placeholder="1. Em um liquidificador, bata 4 xícaras de leite em pó, 4 ovos..."
          />
          <p className="text-xs text-neutral-500">
            Você pode colar aqui seu modo de preparo completo; em seguida a IA vai sugerir a lista
            de ingredientes e utensílios.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="suggestions" className="block text-sm font-medium text-neutral-900">
              Sugestões
            </label>
            <textarea
              id="suggestions"
              name="suggestions"
              rows={3}
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              placeholder="Sugestões de acompanhamento, substituições, variações..."
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="notesAuthor" className="block text-sm font-medium text-neutral-900">
              Notas do autor (privadas)
            </label>
            <textarea
              id="notesAuthor"
              name="notesAuthor"
              rows={3}
              className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
              placeholder="Notas pessoais sobre ajustes, testes, falhas, etc."
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="notesPublic" className="block text-sm font-medium text-neutral-900">
            Notas adicionais (visíveis para leitores)
          </label>
          <textarea
            id="notesPublic"
            name="notesPublic"
            rows={2}
            className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-2 ring-transparent transition focus:border-neutral-900 focus:ring-neutral-900"
            placeholder="Detalhes extras que aparecerão junto da receita."
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Salvar receita
          </button>
        </div>
      </form>
    </section>
  );
}
