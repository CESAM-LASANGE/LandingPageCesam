import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

type Props = { id: string; eyebrow: string; title: string; aside?: ReactNode; as?: 'h1' | 'h2' };

export function SectionHeader({ id, eyebrow, title, aside, as: Titulo = 'h2' }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <p className="eyebrow">{eyebrow}</p>
        <Titulo id={id} className="h2">
          {title}
        </Titulo>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
