import { research } from '@/content/site';
import { Icon } from './Icon';
import { SectionHeader } from './SectionHeader';
import styles from './Research.module.css';

export function Research() {
  return (
    <section id="pesquisa" className="section section--alt" aria-labelledby="pesquisa-title">
      <div className="container stack">
        <SectionHeader
          id="pesquisa-title"
          eyebrow={research.eyebrow}
          title={research.title}
          aside={<p className={`lead ${styles.lead}`}>{research.lead}</p>}
        />
        <ul className={styles.grid}>
          {research.lines.map((line) => (
            <li key={line.title} className={`lift reveal ${styles.card}`}>
              <span className={styles.icon}>
                <Icon name={line.icon} size={26} />
              </span>
              <div className={styles.body}>
                <h3 className={styles.title}>{line.title}</h3>
                <p className={styles.text}>
                  <span className={styles.long}>{line.text}</span>
                  <span className={styles.short}>{line.shortText}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
