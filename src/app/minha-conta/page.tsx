// import { requireSession } from "@/lib/auth-session";

import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { getServerSession } from "@/lib/get-server-session";
// import { requireSession } from "@/lib/auth-session";

export default async function MinhaContaPage() {
  const session = await getServerSession();
  // const session = await requireSession("/sign-in?redirectTo=/minha-conta");

  // console.log(session.)

  if (!session?.user.id) {
    redirect("/unauthorized");
  }

  return (
    <main className="min-h-dvh bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="border-b border-stone-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-500">
            Minha conta
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Perfil da conta
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
            Gerencie suas informações básicas e acompanhe sua participação no
            Queimando Panela.
          </p>
        </header>
        <div className="mt-8">
          <LogoutButton className="h-11 rounded-none border-stone-300" />
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Dados de acesso
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-stone-500">Nome</dt>
                <dd className="mt-1 text-stone-900">{session.user.name}</dd>
              </div>

              <div>
                <dt className="text-stone-500">E-mail</dt>
                <dd className="mt-1 text-stone-900">{session.user.email}</dd>
              </div>

              <div>
                <dt className="text-stone-500">Conta verificada</dt>
                <dd className="mt-1 text-stone-900">
                  {session.user.emailVerified ? "Sim" : "Não"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Participação
            </h2>

            <div className="mt-5 space-y-4 text-sm text-stone-600">
              <p>
                Em breve, aqui você poderá ver suas receitas enviadas, favoritas
                e histórico de contribuições.
              </p>
              <p>
                Essa área será a base para edições de perfil e gerenciamento de
                conteúdo.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
