import { platforms } from '@/content/site';
import { buildTiles } from '@/lib/tiles';
import { Icon } from './Icon';
import { SectionHeader } from './SectionHeader';
import styles from './Platforms.module.css';

const tiles = buildTiles();
export function Platforms() {
  const { observatorio: obs, residuos } = platforms;
  const noAr = Boolean(residuos.href);

  const residuosBody = (
    <>
      <div className={styles.resTop}>
        <span className={styles.resLogo}>
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem estática */}
          <img src="/images/residuos-logo.webp" alt={residuos.name} width={410} height={85} loading="lazy" />
        </span>
        {noAr ? (
          <span className={styles.resArrow}>
            <Icon name="arrowUpRight" size={20} strokeWidth={2.2} className="go" />
          </span>
        ) : (
          <span className={styles.resBadge}>
            <span className={styles.resDot} aria-hidden="true" />
            {residuos.badge}
          </span>
        )}
      </div>
      <div className={styles.resText}>
        <p className={styles.resKicker}>{residuos.kicker}</p>
        <h3 className={styles.resTitle}>{residuos.title}</h3>
        <p className={styles.resLead}>{residuos.text}</p>
      </div>
      <dl className={styles.resFigures}>
        {residuos.figures.map((f) => (
          <div key={f.label}>
            <dt className="visually-hidden">{f.label}</dt>
            <dd className={styles.resFigure}>{f.value}</dd>
            <dd className={styles.resFigureLabel} aria-hidden="true">
              {f.label}
            </dd>
          </div>
        ))}
      </dl>
      <ul className={styles.resThemes}>
        {residuos.themes.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {noAr ? (
        <span className={styles.resCta}>
          {residuos.cta} <span className="go">→</span>
        </span>
      ) : (
        <p className={styles.resStatus}>{residuos.status}</p>
      )}
      <p className={styles.resCredit}>{residuos.credit}</p>
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
            <article className={`reveal ${styles.card} ${styles.res}`}>{residuosBody}</article>
          )}
        </div>
      </div>
    </section>
  );
}
