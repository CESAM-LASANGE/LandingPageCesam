import { hero } from '@/content/site';
import { Icon } from './Icon';
import styles from './Hero.module.css';

const star = '12,2 14.9,8.9 22.4,9.3 16.6,14.1 18.5,21.4 12,17.3 5.5,21.4 7.4,14.1 1.6,9.3 9.1,8.9';

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`eyebrow rise d1 ${styles.eyebrow}`}>
            <svg className={styles.twinkle} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <polygon points={star} fill="#F2D52B" stroke="#B89A00" strokeWidth="1" />
            </svg>
            {hero.eyebrow}
          </p>
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
          <svg viewBox="0 0 536 540" className={styles.svg} aria-hidden="true" focusable="false">
            <circle cx="300" cy="300" r="236" fill="#EEF4FD" />
            <circle
              className={styles.ripple}
              cx="300"
              cy="300"
              r="236"
              fill="none"
              stroke="#9DBDEB"
              strokeWidth="1.5"
            />
            <circle
              className={`${styles.ripple} ${styles.r2}`}
              cx="300"
              cy="300"
              r="236"
              fill="none"
              stroke="#9DBDEB"
              strokeWidth="1.5"
            />
            <path
              className={styles.floatA}
              d="M70 430 C 40 260 150 110 340 64 C 312 210 262 340 70 430 Z"
              fill="#177A35"
            />
            <path
              className={styles.floatB}
              d="M300 40 C 360 140 470 250 470 350 A 170 170 0 0 1 130 350 C 130 250 240 140 300 40 Z"
              fill="#6FA3EF"
            />
            <path
              className={styles.draw}
              d="M-6 250 C 140 196 330 186 520 238"
              fill="none"
              stroke="#0F1411"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              className={styles.draw}
              d="M-6 250 C 140 196 330 186 520 238"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              className={styles.draw2}
              d="M20 296 C 170 256 350 254 500 290"
              fill="none"
              stroke="#0F1411"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              className={styles.draw2}
              d="M20 296 C 170 256 350 254 500 290"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <polygon
              className={styles.twinkle}
              points="380,380 388.6,400.6 411,401.8 393.6,416.2 399.4,438 380,425.8 360.6,438 366.4,416.2 349,401.8 371.4,400.6"
              fill="#F2D52B"
              stroke="#B89A00"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
