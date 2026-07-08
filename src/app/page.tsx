import { ClassicRecipesSection } from '@/components/home/ClassicRecipesSection';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestRecipesSection } from '@/components/home/LatestRecipesSection';
import OtherProjects from '@/components/home/OtherProjects';
import SignUpSection from '@/components/home/SignUpSection';
import Footer from '@/components/layout/Footer';
import { getClassicRecipes } from '@/features/recipes/actions/get-classic-recipes';
import { getLatestRecipes } from '@/features/recipes/actions/get-latest-recipes';
import { getRandomRecipe } from '@/features/recipes/actions/get-random-recipe';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
  description:
    'Descubra receitas criadas por cozinheiros amadores. Pratos afetivos, sabores regionais e experiências gastronômicas compartilhadas pela comunidade.',
  openGraph: {
    title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    description:
      'Descubra receitas criadas por cozinheiros amadores. Pratos afetivos, sabores regionais e experiências gastronômicas compartilhadas pela comunidade.',
    type: 'website',
  },
};

export default async function Home() {
  const [latestRecipes, classicRecipes, featuredRecipe] = await Promise.all([
    getLatestRecipes(3),
    getClassicRecipes(4, 1),
    getRandomRecipe(),
  ]);


  return (
    <main className="bg-background min-h-screen pt-24">
      <HeroSection featuredRecipe={featuredRecipe} />
      <LatestRecipesSection recipes={latestRecipes} />
      <ClassicRecipesSection rows={classicRecipes} />
      <SignUpSection />
      <OtherProjects />
      <Footer />
    </main>
  );
}
