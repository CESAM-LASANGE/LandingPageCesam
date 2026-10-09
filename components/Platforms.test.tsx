import { render, screen, within } from '@testing-library/react';
import { platforms } from '@/content/site';
import { Platforms } from './Platforms';

describe('Plataformas · card do Portal de Resíduos Sólidos', () => {
  const hrefOriginal = platforms.residuos.href;
  afterEach(() => {
    platforms.residuos.href = hrefOriginal;
  });

  it('enquanto o portal não está no ar, avisa "Em breve" e não oferece link', () => {
    platforms.residuos.href = undefined;
    render(<Platforms />);
    const card = screen.getByRole('heading', { level: 3, name: platforms.residuos.title }).closest('article')!;
    expect(within(card).getAllByText('Em breve').length).toBeGreaterThan(0);
    expect(within(card).getByText(platforms.residuos.status)).toBeInTheDocument();
    expect(within(card).queryByRole('link')).toBeNull();
    expect(within(card).getByRole('img', { name: 'Portal Resíduos MS' })).toBeInTheDocument();
  });

  it('usa os textos e números do próprio portal, sem placeholders', () => {
    render(<Platforms />);
    const card = screen
      .getByRole('heading', { level: 3, name: 'Informação para dar o destino certo.' })
      .closest('article')!;
    expect(within(card).getByText('Projeto Disposição Legal')).toBeInTheDocument();
    expect(within(card).getByText('79')).toBeInTheDocument();
    expect(within(card).getByText('80% → 5%')).toBeInTheDocument();
    expect(within(card).queryByText(/\[/)).toBeNull();
    expect(document.querySelectorAll('[data-pending-link]')).toHaveLength(0);
  });

  it('quando o endereço for informado, o card vira link e o aviso some', () => {
    platforms.residuos.href = 'https://exemplo.org/portal/';
    render(<Platforms />);
    const link = screen.getByRole('link', { name: /Informação para dar o destino certo/ });
    expect(link).toHaveAttribute('href', 'https://exemplo.org/portal/');
    expect(within(link).queryByText('Em breve')).toBeNull();
    expect(within(link).getByText(/Acessar o portal/)).toBeInTheDocument();
  });

  it('o card do Observatório continua levando à plataforma', () => {
    render(<Platforms />);
    expect(screen.getByRole('link', { name: /O retrato do saneamento/ })).toHaveAttribute(
      'href',
      platforms.observatorio.href,
    );
  });
});
