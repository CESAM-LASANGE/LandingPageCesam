import { platforms } from '@/content/site';
import { buildTiles } from '@/lib/tiles';
import { Icon } from './Icon';
import { SectionHeader } from './SectionHeader';
import styles from './Platforms.module.css';

const tiles = buildTiles();
const recycle =
  'M7.5 5.5L10 2l2.5 3.5M10 2v5a4 4 0 0 0 4 4M20.5 13l-1.8 4-4.2-.4M18.7 17l-4.3-2.5a4 4 0 0 0-5.5 1.5M5.8 18.5L3.5 15l2-3.8M3.5 15l4.3-2.5a4 4 0 0 0 1.5-5.5';

export function Platforms() {
  const { observatorio: obs, residuos } = platforms;

  const residuosBody = (
    <>
      <svg className={styles.spin} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={recycle} />
      </svg>
      <div className={styles.row}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          {residuos.badge}
        </span>
        <span className={styles.roundIcon}>
          <Icon name="arrowUpRight" size={20} strokeWidth={2.2} className="go" />
        </span>
      </div>
      <div className={styles.text}>
        <h3 className={styles.resTitle}>{residuos.title}</h3>
        <p className={styles.resText}>{residuos.text}</p>
      </div>
      <div className={styles.resIcon}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={recycle} />
        </svg>
      </div>
      <ul className={styles.resThemes}>
        {residuos.themes.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <span className={styles.resCta}>
        {residuos.cta} <span className="go">→</span>
      </span>
    </>
  );

  return (
    <section id="plataformas" className="section" aria-labelledby="plataformas-title">
      <div className="container stack">
        <SectionHeader
          id="plataformas-title"
          eyebrow={platforms.eyebrow}
          title={platforms.title}
          aside={<p className="lead">{platforms.lead}</p>}
        />
        <div className={styles.grid}>
          <a
            href={obs.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`lift reveal ${styles.card} ${styles.obs}`}
          >
            <span className={styles.shine} aria-hidden="true" />
            <div className={styles.row}>
              <span className={styles.obsLogo}>
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático */}
                <img src="/images/observatorio-logo.svg" alt={obs.name} width={170} height={40} />
              </span>
              <span className={styles.squareIcon}>
                <Icon name="arrowUpRight" size={20} strokeWidth={2.2} className="go" />
              </span>
            </div>
            <div className={styles.text}>
              <h3 className={styles.obsTitle}>{obs.title}</h3>
              <p className={styles.obsText}>
                <span className={styles.long}>{obs.text}</span>
                <span className={styles.short}>{obs.shortText}</span>
              </p>
            </div>
            <div className={styles.data}>
              <div className={styles.tiles} aria-hidden="true">
                {tiles.map((t, i) => (
                  <span key={i} className={styles.tile} style={{ background: t.color, animationDelay: t.delay }} />
                ))}
              </div>
              <dl className={styles.figures}>
                {obs.figures.map((f) => (
                  <div key={f.label}>
                    <dt className="visually-hidden">{f.label}</dt>
                    <dd className={styles.figure} data-long={f.value.length > 4 || undefined}>
                      {f.value}
                    </dd>
                    <dd className={styles.figureLabel} aria-hidden="true">
                      {f.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className={styles.themes}>
              {obs.themes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <span className={styles.obsCta}>
              {obs.cta} <span className="go">→</span>
            </span>
            <span className="visually-hidden"> (abre em nova aba)</span>
          </a>

          {residuos.href ? (
            <a href={residuos.href} className={`lift reveal ${styles.card} ${styles.res}`}>
              {residuosBody}
            </a>
          ) : (
            <article className={`reveal ${styles.card} ${styles.res}`} data-pending-link="">
              {residuosBody}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
