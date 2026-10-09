import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { contact } from '@/content/site';
import { Contact } from './Contact';
import { ContactForm } from './ContactForm';

describe('Contato · dados do CESAM', () => {
  it('mostra o e-mail institucional como link mailto', () => {
    render(<Contact />);
    expect(contact.email).toBe('cesam@uems.br');
    const link = screen.getByRole('link', { name: 'cesam@uems.br' });
    expect(link).toHaveAttribute('href', 'mailto:cesam@uems.br');
  });

  it('mostra o telefone (67) 3902-2547 como link para ligar', () => {
    render(<Contact />);
    const link = screen.getByRole('link', { name: '(67) 3902-2547' });
    expect(link).toHaveAttribute('href', 'tel:+556739022547');
  });

  it('mostra o endereço da UEMS em Dourados, sem placeholders', () => {
    render(<Contact />);
    const secao = screen.getByRole('region', { name: 'CESAM' });
    expect(within(secao).getByText(contact.address)).toBeInTheDocument();
    expect(contact.address).toMatch(/UEMS.*Dourados – MS/);
    expect(within(secao).queryByText(/\[/)).toBeNull();
    expect(secao.querySelectorAll('[data-pending-link]')).toHaveLength(0);
  });
});

describe('Contato · mapa de localização', () => {
  it('abre no Google Maps, em nova aba, pelo link do CESAM', () => {
    render(<Contact />);
    const link = screen.getByRole('link', { name: /Abrir no Google Maps/ });
    expect(link).toHaveAttribute('href', 'https://maps.app.goo.gl/HbWZ9ySf2uagoFN56');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('só carrega o mapa do Google depois do clique (privacidade)', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    expect(document.querySelector('iframe')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Carregar mapa' }));
    const mapa = screen.getByTitle(/Mapa com a localização da UEMS em Dourados/);
    expect(mapa.tagName).toBe('IFRAME');
    expect(mapa).toHaveAttribute('src', expect.stringContaining('-22.1976768,-54.9315119'));
    expect(mapa).toHaveAttribute('loading', 'lazy');
    expect(screen.queryByRole('button', { name: 'Carregar mapa' })).toBeNull();
  });

  it('avisa que carregar o mapa envia o acesso ao Google', () => {
    render(<Contact />);
    expect(screen.getByText(/Google/, { selector: 'p' })).toBeInTheDocument();
  });
});

describe('Contato · formulário', () => {
  const preencher = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Nome'), 'Maria Souza');
    await user.type(screen.getByLabelText('E-mail'), 'maria@exemplo.com');
    await user.type(screen.getByLabelText('Mensagem'), 'Gostaria de agendar uma visita técnica.');
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
  };

  it('com e-mail institucional, abre o e-mail do visitante com a mensagem para cesam@uems.br', async () => {
    const user = userEvent.setup();
    const abrir = vi.fn();
    render(<ContactForm to="cesam@uems.br" subjects={['Imprensa', 'Outro']} abrirEmail={abrir} />);
    await preencher(user);
    expect(abrir).toHaveBeenCalledTimes(1);
    const url = decodeURIComponent(abrir.mock.calls[0]![0] as string);
    expect(url).toMatch(/^mailto:cesam@uems\.br\?subject=\[Site CESAM\] Imprensa/);
    expect(url).toContain('Gostaria de agendar uma visita técnica.');
    expect(screen.getByRole('status')).toHaveTextContent(/Abrimos seu aplicativo de e-mail/);
  });

  it('sem e-mail configurado, informa que o envio não está disponível e não abre nada', async () => {
    const user = userEvent.setup();
    const abrir = vi.fn();
    render(<ContactForm subjects={['Imprensa']} abrirEmail={abrir} />);
    await preencher(user);
    expect(abrir).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(/ainda não está disponível/);
  });

  it('não abre o e-mail com dados inválidos', async () => {
    const user = userEvent.setup();
    const abrir = vi.fn();
    render(<ContactForm to="cesam@uems.br" subjects={['Imprensa']} abrirEmail={abrir} />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));
    expect(abrir).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nome')).toHaveFocus();
    await user.tab();
  });
});
