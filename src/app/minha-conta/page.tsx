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
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-2 border-[#1b2920] bg-white p-6">
          <p className="inline-block bg-[#a85131] border border-[#1b2920] px-2 py-1 font-display text-xs font-extrabold uppercase tracking-[0.14em] text-[#1b2920]">
            Minha conta
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.02em] text-[#1b2920]">
            Perfil da conta
          </h1>
          <p className="mt-2 max-w-2xl border-l border-[rgba(27,41,32,0.16)] pl-3 font-sans text-sm leading-5 text-[#3e4d42]">
            Gerencie suas informações e acompanhe sua participação no Queimando
            Panela.
          </p>
        </header>

        <div className="mt-6">
          <LogoutButton className="h-12 border-2" />
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border-2 border-[#1b2920] bg-white p-5">
            <h2 className="border-b-2 border-[#1b2920] pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#1b2920]">
              Dados de acesso
            </h2>
            <dl className="mt-4 space-y-3 font-sans text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2 border border-[rgba(27,41,32,0.16)] bg-[#e8ddca] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#3e4d42]">
                  Nome
                </dt>
                <dd className="font-bold text-[#1b2920]">
                  {session.user.name}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 border border-[rgba(27,41,32,0.16)] bg-[#e8ddca] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#3e4d42]">
                  E-mail
                </dt>
                <dd className="font-bold text-[#1b2920] break-all">
                  {session.user.email}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 border-2 border-[#a85131] bg-[#a85131] px-3 py-2">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.1em] text-[#1b2920]">
                  Verificada
                </dt>
                <dd className="font-extrabold text-[#1b2920]">
                  {session.user.emailVerified ? 'Sim' : 'Não'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-2 border-[#1b2920] bg-[#1b2920] p-5 text-white">
            <h2 className="border-b-2 border-[#a85131] pb-2 font-display text-sm font-extrabold uppercase tracking-[0.12em] text-[#a85131]">
              Participação
            </h2>
            <div className="mt-4 space-y-3 font-sans text-sm leading-6 text-white/70">
              <p>
                Em breve suas receitas enviadas e favoritas aparecerão aqui —
                quadradas e amarelas.
              </p>
              <p>Base para edições de perfil e gerenciamento de conteúdo.</p>
            </div>
            <div className="mt-4 h-1 w-full bg-[#a85131]" aria-hidden="true" />
          </div>
        </section>
      </div>
    </main>
  );
}
