import type { Metadata } from 'next';
import { AboutCommunity } from '@/components/about/AboutCommunity';
import { AboutCopilot } from '@/components/about/AboutCopilot';
import { AboutCta } from '@/components/about/AboutCta';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutSteps } from '@/components/about/AboutSteps';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Conheça o Queimando Panela — um blog de receitas caseiras onde a IA é co-piloto, não protagonista. Escreva como faz em casa, a confere e publique com confiança.',
  openGraph: {
    title: 'Sobre — Queimando Panela',
    description:
      'Receitas caseiras com IA que confere, não substitui. Olhômetro vale tanto quanto gramas.',
    type: 'website',
  },
};

export default function SobrePage() {
  return (
    <main>
      <AboutHero />
      <AboutSteps />
      <AboutCopilot />
      <AboutCommunity />
      <AboutCta />
    </main>
  );
}
