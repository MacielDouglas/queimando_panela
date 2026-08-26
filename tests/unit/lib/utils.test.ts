import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('concatena classes simples', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolve conflito de classes do Tailwind: p-2 + p-4 => p-4', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('resolve conflito de classes do Tailwind (px)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('mescla classes condicionais (truthy/falsy)', () => {
    const isActive = true;
    const isDisabled = false;
    expect(
      cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled'),
    ).toBe('btn btn-active');
  });

  it('suporta sintaxe condicional ternária', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold');
    expect(cn('text-sm', 'font-normal')).toBe('text-sm font-normal');
  });

  it('ignora valores falsy (undefined, null, false)', () => {
    expect(cn('text-sm', undefined, null, false && 'hidden')).toBe('text-sm');
  });

  it('suporta arrays de classes', () => {
    expect(cn(['p-2', 'text-sm'])).toBe('p-2 text-sm');
  });

  it('suporta objeto com chaves condicionais (clsx)', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe(
      'text-red-500',
    );
  });

  it('tailwind-merge mantém última classe conflitante e preserva não-conflitantes', () => {
    // conflito resolvido
    expect(cn('text-sm text-lg')).toBe('text-lg');
    // não-conflitantes preservadas (ordem preservada pelo twMerge)
    expect(cn('p-2 text-sm', 'p-4 font-bold')).toBe('text-sm p-4 font-bold');
  });

  it('retorna string vazia quando nenhum input válido', () => {
    expect(cn()).toBe('');
    expect(cn(null as unknown as string, undefined as unknown as string)).toBe(
      '',
    );
  });

  it('mescla classes com conditional + tailwind-merge juntos', () => {
    const condition = true;
    expect(cn('p-2 bg-red-500', condition && 'p-4', 'bg-blue-500')).toBe(
      'p-4 bg-blue-500',
    );
  });
});
