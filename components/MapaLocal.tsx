'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import styles from './MapaLocal.module.css';

type Props = {
  href: string;
  latitude: number;
  longitude: number;
  titulo: string;
  className?: string;
};

/**
 * Mapa de localização. O mapa do Google só é carregado depois do clique, para o visitante não enviar o acesso
 * ao Google sem querer (docs/architecture/SECURITY.md). O link para abrir no Google Maps está sempre visível.
 */
export function MapaLocal({ href, latitude, longitude, titulo, className }: Props) {
  const [carregado, setCarregado] = useState(false);
  const src = `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed&hl=pt-BR`;

  return (
    <div className={[styles.mapa, className].filter(Boolean).join(' ')}>
      <div className={styles.quadro} data-carregado={carregado || undefined}>
        {carregado ? (
          <iframe
            src={src}
            title={titulo}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.iframe}
          />
        ) : (
          <div className={styles.antes}>
            <span className={styles.pino}>
              <Icon name="pin" size={28} />
            </span>
            <p className={styles.nome}>UEMS · Dourados – MS</p>
            <button type="button" className={`btn btn--ghost ${styles.carregar}`} onClick={() => setCarregado(true)}>
              Carregar mapa
            </button>
            <p className={styles.aviso}>Ao carregar, o mapa é fornecido pelo Google, que recebe o seu acesso.</p>
          </div>
        )}
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className={`more ${styles.abrir}`}>
        Abrir no Google Maps <span className="visually-hidden">(abre em nova aba)</span>{' '}
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
