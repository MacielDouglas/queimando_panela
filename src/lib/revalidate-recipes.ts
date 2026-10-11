import { revalidatePath } from 'next/cache';

/**
 * Revalida o ISR da Home, da listagem e do detalhe após publicar,
 * editar ou excluir receita.
 *
 * O try/catch existe porque fora do runtime do Next (testes unitários)
 * não há "static generation store" — nesse caso a chamada é ignorada
 * e o ISR expira sozinho pela janela de `revalidate`.
 */
export function revalidateRecipePages(): void {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/receitas', 'page');
    revalidatePath('/receitas/[slug]', 'page');
  } catch {
    // noop fora do runtime Next (ex.: vitest)
  }
}
