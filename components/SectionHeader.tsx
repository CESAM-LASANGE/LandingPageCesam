import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

type Props = { id: string; eyebrow: string; title: string; aside?: ReactNode };

export function SectionHeader({ id, eyebrow, title, aside }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="h2">
          {title}
        </h2>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </div>
  );
}
