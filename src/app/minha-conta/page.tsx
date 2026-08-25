import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';
import { getServerSession } from '@/lib/get-server-session';

export default async function MinhaContaPage() {
  const session = await getServerSession();
  if (!session?.user.id) {
    redirect('/unauthorized');
  }

  return (
    <main className="bg-white pb-12">
      <div className="h-[6px] bg-[#ffb900]" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-2 border-[#0a0a0a] bg-white p-6">
          <p className="inline-block bg-[#ffb900] border border-[#0a0a0a] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#0a0a0a]">
            Minha conta
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#0a0a0a]">
            Perfil da conta
          </h1>
          <p className="mt-2 max-w-2xl border-l-[4px] border-[#ffb900] pl-3 font-sans text-sm leading-5 text-[#6b6b6b]">
            Gerencie suas informações e acompanhe sua participação no Queimando
            Panela.
          </p>
        </header>

        <div className="mt-6">
          <LogoutButton className="h-12 border-2" />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border-2 border-[#0a0a0a] bg-white p-5">
            <h2 className="border-b-2 border-[#0a0a0a] pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#0a0a0a]">
              Dados de acesso
            </h2>
            <dl className="mt-4 space-y-3 font-sans text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2 border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#6b6b6b]">
                  Nome
                </dt>
                <dd className="font-bold text-[#0a0a0a]">
                  {session.user.name}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 border border-[#e5e5e5] bg-[#f5f5f5] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#6b6b6b]">
                  E-mail
                </dt>
                <dd className="font-bold text-[#0a0a0a] break-all">
                  {session.user.email}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 border-2 border-[#ffb900] bg-[#ffb900] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#0a0a0a]">
                  Verificada
                </dt>
                <dd className="font-extrabold text-[#0a0a0a]">
                  {session.user.emailVerified ? 'Sim' : 'Não'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-2 border-[#0a0a0a] bg-[#0a0a0a] p-5 text-white">
            <h2 className="border-b-2 border-[#ffb900] pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#ffb900]">
              Participação
            </h2>
            <div className="mt-4 space-y-3 font-sans text-sm leading-6 text-white/70">
              <p>
                Em breve suas receitas enviadas e favoritas aparecerão aqui —
                quadradas e amarelas.
              </p>
              <p>Base para edições de perfil e gerenciamento de conteúdo.</p>
            </div>
            <div className="mt-4 h-1 w-full bg-[#ffb900]" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}
