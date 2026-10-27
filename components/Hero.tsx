import { hero } from '@/content/site';
import { Emblema } from './Emblema';
import { Icon } from './Icon';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow rise d1">{hero.eyebrow}</p>
          <h1 id="hero-title" className={`rise d2 ${styles.title}`}>
            {hero.title}
          </h1>
          <p className={`rise d3 ${styles.lead}`}>{hero.lead}</p>
          <div className={`rise d4 ${styles.actions}`}>
            <a href={hero.primaryCta.href} className="btn btn--primary">
              {hero.primaryCta.label}
              <Icon name="arrow" size={18} strokeWidth={2} />
            </a>
            <a href={hero.secondaryCta.href} className="btn btn--ghost">
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className={styles.art}>
          <Emblema />
        </div>
      </div>
    </section>
  );
}
