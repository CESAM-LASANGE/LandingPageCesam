'use client';

import { useRef, useState, type FormEvent } from 'react';
import { buildMailto, MESSAGE_MAX, validateContact, type ContactData, type ContactErrors } from '@/lib/contact';
import styles from './Contact.module.css';

type Props = {
  to?: string;
  subjects: string[];
  /** Abre o aplicativo de e-mail da pessoa. Injetável para teste. */
  abrirEmail?: (url: string) => void;
};

const abrirNoNavegador = (url: string) => {
  window.location.href = url;
};
type Status = { kind: 'idle' } | { kind: 'sent' } | { kind: 'unavailable' };

const FIELDS: (keyof ContactData)[] = ['name', 'email', 'subject', 'message'];

export function ContactForm({ to, subjects, abrirEmail = abrirNoNavegador }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data: ContactData = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      subject: String(form.get('subject') ?? ''),
      message: String(form.get('message') ?? ''),
    };
    const found = validateContact(data);
    setErrors(found);
    const firstInvalid = FIELDS.find((f) => found[f]);
    if (firstInvalid) {
      setStatus({ kind: 'idle' });
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (!to) {
      setStatus({ kind: 'unavailable' });
      return;
    }
    abrirEmail(buildMailto(to, data));
    setStatus({ kind: 'sent' });
  }

  const describedBy = (field: keyof ContactData) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form ref={formRef} className={`reveal ${styles.form}`} noValidate onSubmit={onSubmit} aria-labelledby="form-title">
      <h3 id="form-title" className={styles.formTitle}>
        Envie uma mensagem
      </h3>
      <div className={styles.pair}>
        <div className={styles.field}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            required
            aria-invalid={!!errors.name}
            aria-describedby={describedBy('name')}
          />
          {errors.name && (
            <p id="name-error" className={styles.error}>
              {errors.name}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="nome@exemplo.com"
            required
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('email')}
          />
          {errors.email && (
            <p id="email-error" className={styles.error}>
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className={`${styles.field} ${styles.subjectField}`}>
        <label htmlFor="subject">Assunto</label>
        <select
          id="subject"
          name="subject"
          defaultValue={subjects[0]}
          aria-invalid={!!errors.subject}
          aria-describedby={describedBy('subject')}
        >
          {subjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {errors.subject && (
          <p id="subject-error" className={styles.error}>
            {errors.subject}
          </p>
        )}
      </div>
      <div className={styles.field}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={MESSAGE_MAX}
          placeholder="Como podemos ajudar?"
          required
          aria-invalid={!!errors.message}
          aria-describedby={describedBy('message')}
        />
        {errors.message && (
          <p id="message-error" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>
      <button type="submit" className={`btn btn--primary ${styles.submit}`}>
        Enviar mensagem
      </button>
      <div role="status" className={styles.status}>
        {status.kind === 'sent' && <p>Abrimos seu aplicativo de e-mail com a mensagem preenchida. Basta enviá-la.</p>}
        {status.kind === 'unavailable' && (
          <p data-kind="warning">O envio pelo site ainda não está disponível. Por favor, use os contatos ao lado.</p>
        )}
      </div>
    </form>
  );
}
