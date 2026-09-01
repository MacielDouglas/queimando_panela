import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { getServerSession } from '@/lib/get-server-session';

export const metadata: Metadata = {
  title: 'Minha conta',
  description: 'Gerencie sua conta no Queimando Panela.',
  robots: { index: false, follow: false },
};

export default async function MinhaContaPage() {
  const session = await getServerSession();
  if (!session?.user.id) {
    redirect('/unauthorized');
  }

  return (
    <main className="pb-12">
      <div className="editorial-container py-8 lg:py-12">
        <header
          className="overflow-hidden bg-white p-6"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--line)',
          }}
        >
          <p
            className="eyebrow-queimando-panela"
            style={{ background: 'var(--food-accent)', color: 'var(--cocoa)' }}
          >
            Minha conta
          </p>
          <h1
            className="mt-3 font-display text-3xl font-extrabold leading-none tracking-[-0.02em]"
            style={{ color: 'var(--cocoa)' }}
          >
            Perfil da conta
          </h1>
          <p
            className="mt-2 max-w-2xl border-l pl-3 text-sm leading-5"
            style={{
              borderColor: 'var(--line)',
              color: 'var(--ink-muted)',
            }}
          >
            Gerencie suas informações e acompanhe sua participação no Queimando
            Panela.
          </p>
        </header>

        <div className="mt-6">
          <LogoutButton />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div
            className="overflow-hidden bg-white p-5"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
            }}
          >
            <h2
              className="border-b pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em]"
              style={{ borderColor: 'var(--line)', color: 'var(--cocoa)' }}
            >
              Dados de acesso
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div
                className="grid grid-cols-[120px_1fr] gap-2 border px-3 py-2"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--muted)',
                }}
              >
                <dt
                  className="font-display text-xs font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  Nome
                </dt>
                <dd className="font-bold" style={{ color: 'var(--cocoa)' }}>
                  {session.user.name}
                </dd>
              </div>
              <div
                className="grid grid-cols-[120px_1fr] gap-2 border px-3 py-2"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--muted)',
                }}
              >
                <dt
                  className="font-display text-xs font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  E-mail
                </dt>
                <dd
                  className="font-bold break-all"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {session.user.email}
                </dd>
              </div>
              <div
                className="grid grid-cols-[120px_1fr] gap-2 border px-3 py-2"
                style={{
                  borderColor: 'var(--food-accent)',
                  background: 'var(--food-accent-soft)',
                }}
              >
                <dt
                  className="font-display text-xs font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--cocoa)' }}
                >
                  Verificada
                </dt>
                <dd
                  className="font-extrabold"
                  style={{ color: 'var(--cocoa)' }}
                >
                  {session.user.emailVerified ? 'Sim' : 'Não'}
                </dd>
              </div>
            </dl>
          </div>

          <div
            className="overflow-hidden p-5"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--line)',
              background: 'var(--cocoa)',
              color: 'white',
            }}
          >
            <h2
              className="border-b pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em]"
              style={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'var(--food-accent)',
              }}
            >
              Participação
            </h2>
            <div
              className="mt-4 space-y-3 text-sm leading-6"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              <p>
                Em breve suas receitas enviadas e favoritas aparecerão aqui.
              </p>
              <p>
                Salve favoritas, publique receitas e acompanhe sua participação
                na comunidade.
              </p>
            </div>
            <div
              className="mt-4 h-[3px] w-12"
              style={{ background: 'var(--food-accent)' }}
              aria-hidden="true"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
