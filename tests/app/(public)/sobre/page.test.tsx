import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SobrePage from '@/app/(public)/sobre/page';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('framer-motion', () => ({
  useInView: () => true,
}));

describe('SobrePage', () => {
  it('renderiza o hero com heading "Queimando Panela?"', () => {
    render(<SobrePage />);

    const headings = screen.getAllByRole('heading', { name: /queimando/i });
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(headings[0].tagName).toBe('H1');
  });

  it('renderiza a seção "Passo a passo"', () => {
    render(<SobrePage />);

    expect(screen.getByText('Passo a passo')).toBeInTheDocument();
  });

  it('renderiza a seção de IA co-piloto', () => {
    render(<SobrePage />);

    const copilot = screen.getAllByText('IA co-piloto');
    expect(copilot.length).toBeGreaterThanOrEqual(1);
  });

  it('renderiza a seção "Comunidade"', () => {
    render(<SobrePage />);

    expect(screen.getByText('Comunidade')).toBeInTheDocument();
  });

  it('renderiza o CTA "Sua vez"', () => {
    render(<SobrePage />);

    expect(screen.getByText('Sua vez')).toBeInTheDocument();
  });

  it('tem link para publicar receita no hero', () => {
    render(<SobrePage />);

    const link = screen.getByRole('link', { name: /publicar receita/i });
    expect(link).toHaveAttribute('href', '/receitas/new');
  });

  it('tem link para explorar receitas no hero', () => {
    render(<SobrePage />);

    const link = screen.getByRole('link', { name: /explorar receitas/i });
    expect(link).toHaveAttribute('href', '/receitas');
  });

  it('renderiza os 5 passos', () => {
    render(<SobrePage />);

    expect(screen.getByText('Escreva como faz em casa')).toBeInTheDocument();
    expect(screen.getByText('A IA confere pra você')).toBeInTheDocument();
    expect(screen.getByText('Revise o rascunho')).toBeInTheDocument();
    expect(screen.getByText('Publique com confiança')).toBeInTheDocument();
    expect(screen.getByText('Compartilhe a história')).toBeInTheDocument();
  });

  it('renderiza as features da IA', () => {
    render(<SobrePage />);

    expect(screen.getByText('Utensílios')).toBeInTheDocument();
    expect(screen.getByText('Tempo estimado')).toBeInTheDocument();
    expect(screen.getByText('Informação nutricional')).toBeInTheDocument();
    expect(screen.getByText('Classificação automática')).toBeInTheDocument();
  });

  it('renderiza os valores da comunidade', () => {
    render(<SobrePage />);

    expect(screen.getAllByText('Afeto primeiro').length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText('Confiança mútua')).toBeInTheDocument();
    expect(screen.getByText('Comunidade que volta')).toBeInTheDocument();
  });
});
