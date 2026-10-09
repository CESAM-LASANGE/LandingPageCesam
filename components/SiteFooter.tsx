import { footer, site } from '@/content/site';
import { SmartLink } from './SmartLink';
import styles from './SiteFooter.module.css';

/** `base`: prefixo dos links âncora ("" na home, "/" em outras páginas). */
export function SiteFooter({ base = '' }: { base?: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.band} aria-hidden="true">
        <span className={styles.green} />
        <span className={styles.blue} />
        <span className={styles.yellow} />
      </div>
      <div className={`container ${styles.main}`}>
        <div className={styles.about}>
          <span className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
            <img
              src="/images/cesam-logo.webp"
              alt={`${site.name}, ${site.institutionShort}`}
              width={492}
              height={159}
              loading="lazy"
            />
          </span>
          <p>{footer.about}</p>
        </div>
        <div className={styles.columns}>
          {footer.columns.map((col) => (
            <nav key={col.title} className={styles.column} aria-labelledby={`footer-${col.title}`}>
              <h2 id={`footer-${col.title}`} className={styles.columnTitle}>
                {col.title}
              </h2>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      link={link.href?.startsWith('#') ? { ...link, href: `${base}${link.href}` } : link}
                      className={styles.link}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className={`container ${styles.legal}`}>
        <p>{footer.copyright}</p>
        <p>{footer.credit}</p>
      </div>
    </footer>
  );
}
