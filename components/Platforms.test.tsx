import { render, screen, within } from '@testing-library/react';
import { platforms } from '@/content/site';
import { Platforms } from './Platforms';

describe('Plataformas · card do Portal de Resíduos Sólidos', () => {
  const hrefOriginal = platforms.residuos.href;
  afterEach(() => {
    platforms.residuos.href = hrefOriginal;
  });

  describe('com o portal no ar', () => {
    it('o card inteiro leva ao portal, em nova aba, e não mostra "Em breve"', () => {
      render(<Platforms />);
      const link = screen.getByRole('link', { name: /Informação para dar o destino certo/ });
      expect(link).toHaveAttribute('href', 'https://portalderesiduos.vercel.app/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(within(link).getByText(/Acessar o portal/)).toBeInTheDocument();
      expect(within(link).getByText(/abre em nova aba/)).toBeInTheDocument();
      expect(within(link).queryByText('Em breve')).toBeNull();
      expect(within(link).queryByText(platforms.residuos.status)).toBeNull();
    });

    it('usa os textos e números do próprio portal, sem placeholders', () => {
      render(<Platforms />);
      const card = screen.getByRole('link', { name: /Informação para dar o destino certo/ });
      expect(within(card).getByText('Projeto Disposição Legal')).toBeInTheDocument();
      expect(within(card).getByText('79')).toBeInTheDocument();
      expect(within(card).getByText('80% → 5%')).toBeInTheDocument();
      expect(within(card).getByRole('img', { name: 'Portal Resíduos MS' })).toBeInTheDocument();
      expect(within(card).queryByText(/\[/)).toBeNull();
      expect(document.querySelectorAll('[data-pending-link]')).toHaveLength(0);
    });
  });

  it('se o portal sair do ar (sem endereço), volta o aviso "Em breve" e o card deixa de ser link', () => {
    platforms.residuos.href = undefined;
    render(<Platforms />);
    const card = screen.getByRole('heading', { level: 3, name: platforms.residuos.title }).closest('article')!;
    expect(within(card).getAllByText('Em breve').length).toBeGreaterThan(0);
    expect(within(card).getByText(platforms.residuos.status)).toBeInTheDocument();
    expect(within(card).queryByRole('link')).toBeNull();
  });

  it('o card do Observatório continua levando à plataforma', () => {
    render(<Platforms />);
    expect(screen.getByRole('link', { name: /O retrato do saneamento/ })).toHaveAttribute(
      'href',
      platforms.observatorio.href,
    );
  });
});
