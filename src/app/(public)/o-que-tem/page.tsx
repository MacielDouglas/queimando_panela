import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { GeladeiraClient } from '@/features/geladeira/components/GeladeiraClient';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'O que tem? | Queimando Panela',
  description:
    'Informe o que tem em casa, escolha doce, salgado ou tanto faz e deixe a IA criar uma receita divertida com o que você tem. Até 3 criações por dia.',
  openGraph: {
    title: 'O que tem? — Queimando Panela',
    description:
      'O que tem em casa? A IA transforma em receita. Doce, salgado ou tanto faz — até 2 perguntinhas se faltar algo.',
  },
};

export default async function GeladeiraPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLogged = Boolean(session?.user);

  return <GeladeiraClient isLogged={isLogged} />;
}
