import Link from 'next/link';
import type { RecipeDifficultyValue } from '../../types/recipe.types';

type FilterOption = {
  label: string;
  value: string;
};

type Props = {
  currentQuery?: string;
  currentCategory?: string;
  currentDifficulty?: RecipeDifficultyValue | '';
  currentTypes?: string[];
  currentUtensils?: string[];
  currentIngredients?: string[];

  categories: FilterOption[];
  types: FilterOption[];
  utensils: FilterOption[];
  ingredients: FilterOption[];
};

const difficultyOptions: {
  label: string;
  value: '' | RecipeDifficultyValue;
}[] = [
  { label: 'Qualquer dificuldade', value: '' },
  { label: 'Fácil', value: 'EASY' },
  { label: 'Fácil / Médio', value: 'EASY_MEDIUM' },
  { label: 'Médio', value: 'MEDIUM' },
  { label: 'Médio / Difícil', value: 'MEDIUM_HARD' },
  { label: 'Difícil', value: 'HARD' },
];

function buildHref(params: URLSearchParams) {
  const query = params.toString();
  return query ? `/receitas?${query}` : '/receitas';
}

function buildBaseParams({
  currentQuery,
  currentCategory,
  currentDifficulty,
  currentTypes = [],
  currentUtensils = [],
  currentIngredients = [],
}: Omit<Props, 'categories' | 'types' | 'utensils' | 'ingredients'>) {
  const params = new URLSearchParams();

  if (currentQuery) params.set('q', currentQuery);
  if (currentCategory) params.set('categoria', currentCategory);
  if (currentDifficulty) params.set('dificuldade', currentDifficulty);

  currentTypes.forEach((item) => params.append('tipo', item));
  currentUtensils.forEach((item) => params.append('utensilio', item));
  currentIngredients.forEach((item) => params.append('ingrediente', item));

  return params;
}

function setSingleParam(base: URLSearchParams, key: string, value?: string) {
  const params = new URLSearchParams(base.toString());

  params.delete('page');

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  return buildHref(params);
}

function toggleMultiParam(base: URLSearchParams, key: string, value: string) {
  const params = new URLSearchParams(base.toString());
  const current = params.getAll(key);
  const hasValue = current.includes(value);

  params.delete('page');
  params.delete(key);

  const nextValues = hasValue
    ? current.filter((item) => item !== value)
    : [...current, value];

  nextValues.forEach((item) => params.append(key, item));

  return buildHref(params);
}

function clearFilters(base: URLSearchParams) {
  const params = new URLSearchParams();
  const q = base.get('q');

  if (q) params.set('q', q);

  return buildHref(params);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.16em] text-neutral-500 uppercase">
      {children}
    </p>
  );
}

function ChipLink({
  href,
  active,
  children,
  activeClassName = 'border-amber-500 bg-amber-500 text-neutral-950',
  inactiveClassName = 'border-neutral-300 bg-white text-neutral-700 hover:border-amber-400 hover:text-amber-700',
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'border px-3 py-1.5 text-xs font-medium transition',
        active ? activeClassName : inactiveClassName,
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function FilterGroup({
  title,
  options,
  activeValues,
  getHref,
}: {
  title: string;
  options: FilterOption[];
  activeValues: string[];
  getHref: (value: string) => string;
}) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-2 border-t border-neutral-200 pt-4">
      <SectionTitle>{title}</SectionTitle>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ChipLink
            key={option.value}
            href={getHref(option.value)}
            active={activeValues.includes(option.value)}
          >
            {option.label}
          </ChipLink>
        ))}
      </div>
    </div>
  );
}

export function RecipeFilters({
  currentQuery,
  currentCategory,
  currentDifficulty,
  currentTypes = [],
  currentUtensils = [],
  currentIngredients = [],
  categories,
  types,
  utensils,
  ingredients,
}: Props) {
  const baseParams = buildBaseParams({
    currentQuery,
    currentCategory,
    currentDifficulty,
    currentTypes,
    currentUtensils,
    currentIngredients,
  });

  const hasActiveFilters =
    !!currentCategory ||
    !!currentDifficulty ||
    currentTypes.length > 0 ||
    currentUtensils.length > 0 ||
    currentIngredients.length > 0;

  return (
    <div className="border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <SectionTitle>Categoria</SectionTitle>

          <div className="flex flex-wrap gap-2">
            <ChipLink
              href={setSingleParam(baseParams, 'categoria', undefined)}
              active={!currentCategory}
              activeClassName="border-neutral-900 bg-neutral-900 text-white"
              inactiveClassName="border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600 hover:text-neutral-900"
            >
              Todas
            </ChipLink>

            {categories.map((cat) => (
              <ChipLink
                key={cat.value}
                href={setSingleParam(baseParams, 'categoria', cat.value)}
                active={currentCategory === cat.value}
              >
                {cat.label}
              </ChipLink>
            ))}
          </div>
        </div>

        <FilterGroup
          title="Ingredientes"
          options={ingredients.slice(0, 12)}
          activeValues={currentIngredients}
          getHref={(value) =>
            toggleMultiParam(baseParams, 'ingrediente', value)
          }
        />

        <div className="space-y-2 border-t border-neutral-200 pt-4">
          <SectionTitle>Dificuldade</SectionTitle>

          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((item) => {
              const active =
                item.value === ''
                  ? !currentDifficulty
                  : currentDifficulty === item.value;

              return (
                <ChipLink
                  key={item.value || 'ALL'}
                  href={setSingleParam(
                    baseParams,
                    'dificuldade',
                    item.value || undefined,
                  )}
                  active={active}
                  activeClassName="border-neutral-900 bg-neutral-900 text-white"
                  inactiveClassName="border-neutral-300 bg-white text-neutral-700 hover:border-neutral-600 hover:text-neutral-900"
                >
                  {item.label}
                </ChipLink>
              );
            })}
          </div>
        </div>

        <FilterGroup
          title="Tipos"
          options={types}
          activeValues={currentTypes}
          getHref={(value) => toggleMultiParam(baseParams, 'tipo', value)}
        />

        <FilterGroup
          title="Utensílios"
          options={utensils.slice(0, 6)}
          activeValues={currentUtensils}
          getHref={(value) => toggleMultiParam(baseParams, 'utensilio', value)}
        />

        {hasActiveFilters && (
          <div className="border-t border-neutral-200 pt-4">
            <Link
              href={clearFilters(baseParams)}
              className="text-xs text-neutral-500 underline hover:text-neutral-900"
            >
              Limpar filtros
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
