import Link from 'next/link';

type Props = {
  currentQuery?: string;
  currentType?: string;
  currentDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  currentUtensil?: string;
};

export function RecipeFilters({
  currentQuery,
  currentType,
  currentDifficulty,
  currentUtensil,
}: Props) {
  const categories = [
    { label: 'Todas', value: '' },
    { label: 'Prato principal', value: 'Prato principal' },
    { label: 'Sobremesas', value: 'Sobremesa' },
    { label: 'Massas', value: 'Massa' },
    { label: 'Aves', value: 'Ave' },
    { label: 'Café da manhã', value: 'Café da manhã' },
    { label: 'Sem carne', value: 'Sem carne' },
    { label: 'Acompanhamentos', value: 'Acompanhamento' },
  ];

  const difficulties: {
    label: string;
    value: '' | 'EASY' | 'MEDIUM' | 'HARD';
  }[] = [
    { label: 'Qualquer dificuldade', value: '' },
    { label: 'Fácil', value: 'EASY' },
    { label: 'Médio', value: 'MEDIUM' },
    { label: 'Difícil', value: 'HARD' },
  ];

  return (
    <div className="border border-neutral-200 bg-white p-4 sm:p-5">
      <form action="/receitas" method="get" className="space-y-4">
        <input type="hidden" name="q" value={currentQuery ?? ''} />

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">
            Navegar por categoria
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active =
                cat.value === '' ? !currentType : currentType === cat.value;

              return (
                <button
                  key={cat.label}
                  type="submit"
                  name="tipo"
                  value={cat.value}
                  className={[
                    'border px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'border-amber-500 bg-amber-500 text-neutral-950'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-amber-400 hover:text-amber-700',
                  ].join(' ')}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 border-t border-neutral-200 pt-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">
            Dificuldade
          </p>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((item) => {
              const active =
                item.value === ''
                  ? !currentDifficulty
                  : currentDifficulty === item.value;

              return (
                <button
                  key={item.value || 'ALL'}
                  type="submit"
                  name="dificuldade"
                  value={item.value}
                  className={[
                    'border px-3 py-1.5 text-xs font-medium transition',
                    active
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {currentUtensil && (
          <div className="border-t border-neutral-200 pt-4">
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">
              Filtro ativo
            </p>
            <div className="flex items-center gap-2">
              <span className="border border-amber-400 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                {currentUtensil}
              </span>
              <Link
                href="/receitas"
                className="text-xs text-neutral-500 underline hover:text-neutral-900"
              >
                limpar
              </Link>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
