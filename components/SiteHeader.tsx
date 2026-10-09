'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { navigation, site } from '@/content/site';
import { Icon } from './Icon';
import styles from './SiteHeader.module.css';

/** `base`: prefixo dos links âncora. Na home é vazio; em outras páginas é "/" (ex.: "/#sobre"). */
export function SiteHeader({ base = '' }: { base?: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brands}>
          <a href={base ? '/' : '#inicio'} className={styles.brand} aria-label={`${site.name}, página inicial`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imagem já otimizada */}
            <img
              src="/images/cesam-logo.webp"
              alt=""
              width={492}
              height={159}
              className={styles.logo}
              fetchPriority="high"
            />
          </a>
          <a
            href="https://www.uems.br"
            className={styles.uems}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Universidade Estadual de Mato Grosso do Sul, abre em nova aba"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
            <img src="/images/uems-logo.webp" alt="" width={185} height={39} className={styles.uemsLogo} />
          </a>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} strokeWidth={2} />
        </button>

        <nav id={menuId} className={styles.nav} data-open={open} aria-label="Navegação principal">
          <ul className={styles.list}>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={`${base}${item.href}`} className={styles.navlink} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`${base}#contato`} className={`btn btn--primary ${styles.cta}`} onClick={() => setOpen(false)}>
                Contato
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
