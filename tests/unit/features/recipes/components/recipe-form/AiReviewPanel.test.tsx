import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AiReviewPanel } from '@/features/recipes/components/recipe-form/AiReviewPanel';
import {
  type AiReviewFormData,
  aiReviewSchema,
} from '@/features/recipes/schemas/recipe-ai-review-schema';

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,
}));

const defaultValues: AiReviewFormData = {
  title: 'Estrogonofe',
  summary: 'Cremoso e saboroso.',
  difficulty: 'MEDIUM',
  difficultyLabel: 'Fácil a Médio',
  types: ['Prato principal'],
  prepTimeMinutes: 15,
  cookTimeMinutes: 20,
  suggestions: 'Troque por frango.',
  nutritionSummary: 'Resumo nutricional.',
  nutritionPer100g: [{ nutrient: 'Calorias', quantity: '200 kcal' }],
  utensils: [{ name: 'Frigideira' }],
  sections: [
    {
      name: 'Receita',
      ingredients: [
        {
          originalText: '300g de filé',
          name: 'filé',
          generalName: 'filé',
        },
        {
          originalText: '200ml de creme de leite',
          name: 'creme de leite',
          generalName: 'creme de leite',
        },
      ],
      modeOfPreparation: 'Refogue.\nFinalize com creme.',
    },
  ],
};

function Wrapper({ values = defaultValues }: { values?: AiReviewFormData }) {
  const form = useForm<AiReviewFormData>({
    resolver: zodResolver(aiReviewSchema),
    defaultValues: values,
  });
  return <AiReviewPanel form={form} />;
}

describe('AiReviewPanel', () => {
  it('renderiza o painel com título e campos editáveis', () => {
    render(<Wrapper />);

    expect(screen.getByDisplayValue('Estrogonofe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Cremoso e saboroso.')).toBeInTheDocument();
  });

  it('renderiza ingredientes da seção', () => {
    render(<Wrapper />);

    expect(screen.getByDisplayValue('300g de filé')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('200ml de creme de leite'),
    ).toBeInTheDocument();
  });

  it('renderiza utensílio editável', () => {
    render(<Wrapper />);

    expect(screen.getByDisplayValue('Frigideira')).toBeInTheDocument();
  });
});

// import { render, screen } from '@testing-library/react';
// import { describe, expect, it } from 'vitest';

// import { AiReviewPanel } from '@/features/recipes/components/recipe-form/AiReviewPanel';

// const base = {
//   title: 'Estrogonofe',
//   summary: 'Estrogonofe cremoso e cheio de sabor.',
//   difficulty: 'MEDIUM' as const,
//   difficultyLabel: 'Fácil a Médio',
//   type: 'Prato principal / Carne',
//   prepTimeMinutes: 15,
//   cookTimeMinutes: 20,
//   suggestions: 'Troque carne por frango.',
//   nutritionSummary: 'Rico em proteínas e gorduras.',
//   nutritionPer100g: [
//     { nutrient: 'Calorias', quantity: '250 kcal' },
//     { nutrient: 'Carboidratos', quantity: '5 g' },
//   ],
//   utensils: ['Frigideira grande', 'Espátula'],
//   sections: [
//     {
//       name: 'Receita',
//       ingredients: ['300g de filé', '200ml de creme de leite'],
//       modeOfPreparation:
//         '1. Refogue a cebola.\n2. Adicione a carne.\n3. Junte os demais ingredientes.',
//     },
//   ],
// };

// describe('AiReviewPanel', () => {
//   it('renderiza título, resumo e metadados', () => {
//     render(<AiReviewPanel data={base} />);

//     expect(screen.getByText('Estrogonofe')).toBeInTheDocument();
//     expect(screen.getByText(/Estrogonofe cremoso/i)).toBeInTheDocument();
//     expect(screen.getByText('Fácil a Médio')).toBeInTheDocument();
//     expect(screen.getByText(/Preparo: 15 min/)).toBeInTheDocument();
//     expect(screen.getByText(/Cozimento: 20 min/)).toBeInTheDocument();
//   });

//   it('renderiza ingredientes, utensílios e sugestões', () => {
//     render(<AiReviewPanel data={base} />);

//     expect(screen.getByText('300g de filé')).toBeInTheDocument();
//     expect(screen.getByText('Frigideira grande')).toBeInTheDocument();
//     expect(screen.getByText(/Troque carne por frango/)).toBeInTheDocument();
//   });

//   it('remove numeração duplicada dos passos', () => {
//     render(<AiReviewPanel data={base} />);

//     expect(screen.getByText('Refogue a cebola.')).toBeInTheDocument();
//     expect(
//       screen.queryByText(/^1\.\sRefogue a cebola\.$/),
//     ).not.toBeInTheDocument();
//   });
// });
