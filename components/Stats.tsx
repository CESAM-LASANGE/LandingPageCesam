import { stats } from '@/content/site';
import styles from './Stats.module.css';

export function Stats() {
  return (
    <section className={styles.stats} aria-label="O CESAM em números">
      <dl className={`container ${styles.grid}`}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.item} data-accent={stat.accent}>
            <dt className={styles.label}>{stat.label}</dt>
            <dd className={styles.value}>{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
