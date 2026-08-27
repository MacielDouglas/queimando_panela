import type { Metadata } from 'next';
import { ClassicRecipesSection } from '@/components/home/ClassicRecipesSection';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestRecipesSection } from '@/components/home/LatestRecipesSection';
import OtherProjects from '@/components/home/OtherProjects';
import SignUpSection from '@/components/home/SignUpSection';
import { getClassicRecipes } from '@/features/recipes/actions/get-classic-recipes';
import { getLatestRecipes } from '@/features/recipes/actions/get-latest-recipes';
import { getRandomRecipe } from '@/features/recipes/actions/get-random-recipe';

// Evita P2021 no `next build` quando o banco ainda não foi migrado (CI / Vercel)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
  description:
    'A Queimando Panela da cozinha — direta, quadrada, amarela e sem frescura. Receitas que parecem da sua mãe.',
  openGraph: {
    title: 'Queimando Panela — Queimando Panela',
    description:
      'A Queimando Panela da cozinha — direta, quadrada, amarela e sem frescura.',
    type: 'website',
  },
};

export default async function Home() {
  const [latestRecipes, classicRecipes, featuredRecipe] = await Promise.all([
    getLatestRecipes(8),
    getClassicRecipes(4, 1),
    getRandomRecipe(),
  ]);

  return (
    <main className="bg-white">
      <HeroSection featuredRecipe={featuredRecipe} />
      <LatestRecipesSection recipes={latestRecipes} />
      <ClassicRecipesSection rows={classicRecipes} />
      <SignUpSection />
      <OtherProjects />
    </main>
  );
}
