import { render, screen, within } from '@testing-library/react';
import { Team } from './Team';

describe('Equipe · coordenação (SPEC-005)', () => {
  it('mostra os dois coordenadores, com o Vinícius primeiro', () => {
    render(<Team />);
    const cards = screen.getAllByRole('article');
    expect(cards.map((c) => within(c).getByRole('heading').textContent)).toEqual([
      'Vinícius de Oliveira Ribeiro',
      'Nélison Ferreira Corrêa',
    ]);
  });

  it('cada coordenador tem foto com descrição e link para o Lattes em nova aba', () => {
    render(<Team />);
    const esperado = [
      ['Vinícius de Oliveira Ribeiro', 'https://lattes.cnpq.br/7060729285519533'],
      ['Nélison Ferreira Corrêa', 'https://lattes.cnpq.br/5432377107139002'],
    ];
    const cards = screen.getAllByRole('article');
    cards.forEach((card, i) => {
      const [nome, lattes] = esperado[i]!;
      expect(within(card).getByRole('img', { name: `Foto de ${nome}` })).toBeInTheDocument();
      const link = within(card).getByRole('link', { name: /Currículo Lattes/ });
      expect(link).toHaveAttribute('href', lattes);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  it('o nome acessível do Lattes diz de quem é o currículo', () => {
    render(<Team />);
    expect(screen.getByRole('link', { name: /Currículo Lattes de Nélison Ferreira Corrêa/ })).toBeInTheDocument();
  });

  it('mostra titulação e área de atuação conforme o Lattes', () => {
    render(<Team />);
    const [vinicius, nelison] = screen.getAllByRole('article');
    expect(vinicius).toHaveTextContent('Doutor em Saneamento Ambiental e Recursos Hídricos (UFMS)');
    expect(vinicius).toHaveTextContent('Engenharia sanitária e ambiental, recursos hídricos e geotecnologias');
    expect(nelison).toHaveTextContent('Doutor em Tecnologias Ambientais (UFMS)');
    expect(nelison).toHaveTextContent('Geoprocessamento, saneamento ambiental e licenciamento ambiental');
    expect(screen.queryByText(/\[Titulação/)).toBeNull();
  });

  it('rótulos de função: Vinícius na coordenação, Nélison como pesquisador', () => {
    render(<Team />);
    const [vinicius, nelison] = screen.getAllByRole('article');
    expect(vinicius).toHaveTextContent('Coordenação');
    expect(nelison).toHaveTextContent('Pesquisador');
    expect(nelison).not.toHaveTextContent(/coordena/i);
  });

  describe('demais integrantes (cards pequenos)', () => {
    const integrantes = () =>
      within(screen.getByRole('list', { name: 'Integrantes do CESAM' })).getAllByRole('listitem');

    it('mostra os integrantes reais, sem placeholders', () => {
      render(<Team />);
      expect(integrantes().map((li) => within(li).getByRole('heading').textContent)).toEqual([
        'Jonailce Oliveira Diodato',
        'Bruna Alves de Souza Oliveira',
        'Elias de Oliveira Junior',
        'Lucas Beraldi de Souza Oliveira',
        'Valquíria Nascimento',
      ]);
      expect(screen.queryByText('[Nome]')).toBeNull();
    });

    it('cada card com Lattes é um link para o currículo, sem texto "Currículo Lattes" visível', () => {
      render(<Team />);
      const esperado: Record<string, string> = {
        'Jonailce Oliveira Diodato': 'https://lattes.cnpq.br/7372237966579605',
        'Bruna Alves de Souza Oliveira': 'https://lattes.cnpq.br/3977340630312154',
        'Lucas Beraldi de Souza Oliveira': 'https://lattes.cnpq.br/4817723878667471',
        'Elias de Oliveira Junior': 'https://lattes.cnpq.br/7679581190983869',
      };
      for (const [nome, href] of Object.entries(esperado)) {
        const link = screen.getByRole('link', { name: new RegExp(`^${nome}.*Currículo Lattes`) });
        expect(link).toHaveAttribute('href', href);
        expect(link).toHaveAttribute('target', '_blank');
        expect(within(link).getByRole('img', { name: `Foto de ${nome}` })).toBeInTheDocument();
      }
      // "Currículo Lattes" só existe como texto para leitor de tela, nunca visível no card.
      const lista = screen.getByRole('list', { name: 'Integrantes do CESAM' });
      for (const el of within(lista).queryAllByText(/Currículo Lattes/)) {
        expect(el).toHaveClass('visually-hidden');
      }
    });

    it('nenhum integrante fica escondido no celular', () => {
      render(<Team />);
      expect(integrantes().filter((li) => li.hasAttribute('data-extra'))).toHaveLength(0);
    });

    it('Valquíria (administrativo) não tem link de Lattes', () => {
      render(<Team />);
      const valquiria = integrantes().at(-1)!;
      expect(within(valquiria).queryByRole('link')).toBeNull();
      expect(within(valquiria).getByRole('img', { name: 'Foto de Valquíria Nascimento' })).toBeInTheDocument();
    });
  });
});
