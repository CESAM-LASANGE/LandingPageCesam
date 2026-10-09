import { buildMailto, MESSAGE_MAX, validateContact } from './contact';

const valid = {
  name: 'Maria Souza',
  email: 'maria@exemplo.com',
  subject: 'Imprensa',
  message: 'Gostaria de agendar uma visita.',
};

describe('validateContact', () => {
  it('aceita dados válidos', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('exige nome, e-mail válido, assunto e mensagem', () => {
    const errors = validateContact({ name: ' ', email: 'maria@', subject: '', message: 'curta' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });

  it('limita o tamanho da mensagem', () => {
    expect(validateContact({ ...valid, message: 'a'.repeat(MESSAGE_MAX + 1) }).message).toMatch(/no máximo/);
  });
});

describe('buildMailto', () => {
  it('codifica destinatário, assunto e corpo', () => {
    const url = buildMailto('contato@uems.br', { ...valid, message: 'Olá & até já?' });
    expect(url.startsWith('mailto:contato%40uems.br?subject=')).toBe(true);
    expect(decodeURIComponent(url)).toContain('[Site CESAM] Imprensa');
    expect(decodeURIComponent(url)).toContain('Olá & até já?');
    expect(url).not.toMatch(/[\s&]body=.*&/);
  });
});
