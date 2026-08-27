import type { Metadata } from 'next';
import { ClassicRecipesSection } from '@/components/home/ClassicRecipesSection';
import { GastronomySection } from '@/components/home/GastronomySection';
import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { LatestRecipesSection } from '@/components/home/LatestRecipesSection';
import SignUpSection from '@/components/home/SignUpSection';
import { getClassicRecipes } from '@/features/recipes/actions/get-classic-recipes';
import { getLatestRecipes } from '@/features/recipes/actions/get-latest-recipes';

// Evita P2021 no `next build` quando o banco ainda não foi migrado (CI / Vercel)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
  description:
    'Descubra, guarde e compartilhe receitas de família. Histórias que merecem ser lembradas, direto da cozinha de quem faz com carinho.',
  openGraph: {
    title: 'Queimando Panela — Receitas caseiras, afetivas e autorais',
    description:
      'Descubra, guarde e compartilhe receitas de família. Histórias que merecem ser lembradas.',
    type: 'website',
  },
};

export default async function Home() {
  const [latestRecipes, classicRecipes] = await Promise.all([
    getLatestRecipes(6),
    getClassicRecipes(4, 1),
  ]);

  return (
    <main className="bg-white">
      <HeroSection />
      <IntroSection />
      <LatestRecipesSection recipes={latestRecipes} />
      <GastronomySection recipes={latestRecipes} />
      <ClassicRecipesSection rows={classicRecipes} />
      <SignUpSection />
    </main>
  );
}
