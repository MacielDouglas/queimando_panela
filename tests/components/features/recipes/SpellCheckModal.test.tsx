import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SpellCheckModal } from '@/features/recipes/components/spell-check-modal';
import type { DiffLine } from '@/features/recipes/hooks/use-spell-check';

const noDiffs: DiffLine[] = [
  {
    field: 'title',
    label: 'Título',
    original: 'Bolo de Banana',
    corrected: 'Bolo de Banana',
    changed: false,
  },
];

const withDiffs: DiffLine[] = [
  {
    field: 'title',
    label: 'Título',
    original: 'bolo de banana',
    corrected: 'Bolo de Banana',
    changed: true,
  },
  {
    field: 'summary',
    label: 'Resumo',
    original: 'Receita gostosa',
    corrected: 'Receita gostosa',
    changed: false,
  },
];

describe('SpellCheckModal', () => {
  it('exibe mensagem de nenhuma correção quando não há diffs', () => {
    render(<SpellCheckModal diffs={noDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Nenhuma correção necessária.')).toBeInTheDocument();
  });

  it('exibe estado de sucesso quando nenhum campo mudou', () => {
    render(<SpellCheckModal diffs={noDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Texto sem correções!')).toBeInTheDocument();
  });

  it('exibe contagem de campos corrigidos', () => {
    render(<SpellCheckModal diffs={withDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('1 campo corrigido')).toBeInTheDocument();
  });

  it('exibe label e conteúdo do campo corrigido', () => {
    render(<SpellCheckModal diffs={withDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('bolo de banana')).toBeInTheDocument();
    expect(screen.getByText('Bolo de Banana')).toBeInTheDocument();
  });

  it('mostra botão "Aplicar correções" quando há diffs', () => {
    render(<SpellCheckModal diffs={withDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: /aplicar correções/i })).toBeInTheDocument();
  });

  it('não mostra botão "Aplicar correções" quando não há diffs', () => {
    render(<SpellCheckModal diffs={noDiffs} onApply={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /aplicar correções/i })).not.toBeInTheDocument();
  });

  it('chama onClose ao clicar em "Ignorar"', () => {
    const onClose = vi.fn();
    render(<SpellCheckModal diffs={withDiffs} onApply={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /ignorar/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('chama onApply ao clicar em "Aplicar correções"', () => {
    const onApply = vi.fn();
    render(<SpellCheckModal diffs={withDiffs} onApply={onApply} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /aplicar correções/i }));
    expect(onApply).toHaveBeenCalledOnce();
  });

  it('chama onClose ao clicar no backdrop', () => {
    const onClose = vi.fn();
    render(<SpellCheckModal diffs={noDiffs} onApply={vi.fn()} onClose={onClose} />);
    fireEvent.click(document.querySelector('.absolute.inset-0')!);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
