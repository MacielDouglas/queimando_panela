import type { Metadata } from 'next';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { CtaSection } from '@/components/home/CtaSection';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { LatestRecipesSection } from '@/components/home/LatestRecipesSection';
import { RecipesSection } from '@/components/home/RecipesSection';
import { ValuesSection } from '@/components/home/ValuesSection';
import { getClassicRecipes } from '@/features/recipes/actions/get-classic-recipes';
import { getLatestRecipes } from '@/features/recipes/actions/get-latest-recipes';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
  description:
    'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas.',
  openGraph: {
    title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    description:
      'Sabores autênticos, ingredientes selecionados e receitas que aproximam pessoas.',
    type: 'website',
  },
};

export default async function Home() {
  const [latestRecipes, classicRecipes] = await Promise.all([
    getLatestRecipes(6),
    getClassicRecipes(3, 1),
  ]);

  return (
    <main>
      <HeroSection />
      <IntroSection />
      <CategoriesSection />
      <ValuesSection />
      <RecipesSection rows={classicRecipes} />
      <LatestRecipesSection recipes={latestRecipes} />
      <CtaSection />
    </main>
  );
}
