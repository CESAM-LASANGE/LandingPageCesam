export type ContactData = { name: string; email: string; subject: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MESSAGE_MAX = 2000;

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.trim().length < 2) errors.name = 'Informe seu nome.';
  if (!EMAIL.test(data.email.trim())) errors.email = 'Informe um e-mail válido, como nome@exemplo.com.';
  if (!data.subject.trim()) errors.subject = 'Escolha um assunto.';
  const message = data.message.trim();
  if (message.length < 10) errors.message = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  else if (message.length > MESSAGE_MAX) errors.message = `A mensagem deve ter no máximo ${MESSAGE_MAX} caracteres.`;
  return errors;
}

/**
 * Monta um link `mailto:` com a mensagem. O site não coleta nem armazena dados:
 * o envio acontece no aplicativo de e-mail da própria pessoa (docs/architecture/SECURITY.md).
 */
export function buildMailto(to: string, data: ContactData): string {
  const subject = `[Site CESAM] ${data.subject.trim()}`;
  const body = `${data.message.trim()}\n\n${data.name.trim()}\n${data.email.trim()}`;
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
