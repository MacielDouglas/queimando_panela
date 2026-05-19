import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';

describe('field ui components', () => {
  it('renderiza Field com orientação padrão vertical', () => {
    render(<Field data-testid="field">Conteúdo</Field>);

    const field = screen.getByTestId('field');
    expect(field).toBeInTheDocument();
    expect(field).toHaveAttribute('role', 'group');
    expect(field).toHaveAttribute('data-slot', 'field');
    expect(field).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renderiza Field com orientação horizontal', () => {
    render(
      <Field data-testid="field" orientation="horizontal">
        Conteúdo
      </Field>,
    );

    expect(screen.getByTestId('field')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
  });

  it('renderiza Field com orientação responsive', () => {
    render(
      <Field data-testid="field" orientation="responsive">
        Conteúdo
      </Field>,
    );

    expect(screen.getByTestId('field')).toHaveAttribute(
      'data-orientation',
      'responsive',
    );
  });

  it('renderiza FieldSet e FieldLegend', () => {
    render(
      <FieldSet data-testid="fieldset">
        <FieldLegend>Dados da conta</FieldLegend>
      </FieldSet>,
    );

    expect(screen.getByTestId('fieldset')).toBeInTheDocument();
    expect(screen.getByText('Dados da conta')).toBeInTheDocument();
    expect(screen.getByText('Dados da conta').tagName).toBe('LEGEND');
  });

  it('renderiza FieldLegend com variant label', () => {
    render(
      <FieldLegend data-testid="legend" variant="label">
        Nome
      </FieldLegend>,
    );

    expect(screen.getByTestId('legend')).toHaveAttribute(
      'data-variant',
      'label',
    );
  });

  it('renderiza FieldGroup e FieldContent', () => {
    render(
      <FieldGroup data-testid="group">
        <FieldContent data-testid="content">Texto</FieldContent>
      </FieldGroup>,
    );

    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Texto')).toBeInTheDocument();
  });

  it('renderiza FieldLabel, FieldTitle e FieldDescription', () => {
    render(
      <>
        <FieldLabel htmlFor="email">E-mail</FieldLabel>
        <FieldTitle>Título do campo</FieldTitle>
        <FieldDescription>Descrição do campo</FieldDescription>
        <input id="email" />
      </>,
    );

    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Título do campo')).toBeInTheDocument();
    expect(screen.getByText('Descrição do campo')).toBeInTheDocument();
  });

  it('renderiza FieldSeparator sem conteúdo adicional', () => {
    render(<FieldSeparator data-testid="separator" />);

    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-content', 'false');
    expect(
      within(separator).queryByTestId('field-separator-content'),
    ).not.toBeInTheDocument();
  });

  it('renderiza FieldSeparator com conteúdo adicional', () => {
    render(
      <FieldSeparator data-testid="separator">ou continue com</FieldSeparator>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-content', 'true');
    expect(screen.getByText('ou continue com')).toBeInTheDocument();
  });

  it('FieldError renderiza children diretamente', () => {
    render(<FieldError>Erro customizado</FieldError>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Erro customizado');
  });

  it('FieldError não renderiza nada quando não há children nem errors', () => {
    const { container } = render(<FieldError />);
    expect(container).toBeEmptyDOMElement();
  });

  it('FieldError não renderiza nada quando errors é vazio', () => {
    const { container } = render(<FieldError errors={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('FieldError renderiza mensagem única quando há apenas um erro', () => {
    render(<FieldError errors={[{ message: 'Campo obrigatório' }]} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório');
  });

  it('FieldError remove erros duplicados', () => {
    render(
      <FieldError
        errors={[
          { message: 'Campo obrigatório' },
          { message: 'Campo obrigatório' },
        ]}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Campo obrigatório');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('FieldError renderiza lista quando há múltiplos erros distintos', () => {
    render(
      <FieldError
        errors={[
          { message: 'Nome é obrigatório' },
          { message: 'E-mail é obrigatório' },
        ]}
      />,
    );

    const alert = screen.getByRole('alert');
    const items = within(alert).getAllByRole('listitem');

    expect(items).toHaveLength(2);
    expect(alert).toHaveTextContent('Nome é obrigatório');
    expect(alert).toHaveTextContent('E-mail é obrigatório');
  });

  it('FieldError ignora itens sem message e renderiza apenas os válidos', () => {
    render(
      <FieldError
        errors={[undefined, { message: 'Erro válido' }, { message: undefined }]}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Erro válido');
  });
});
