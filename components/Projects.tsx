import { projects } from '@/content/site';
import { SectionHeader } from './SectionHeader';
import { SmartLink } from './SmartLink';
import styles from './Projects.module.css';

export function Projects() {
  const allLink = (
    <SmartLink link={projects.all} className="more">
      {projects.all.label} <span className="go">→</span>
    </SmartLink>
  );
  return (
    <section id="projetos" className="section section--alt" aria-labelledby="projetos-title">
      <div className="container stack">
        <SectionHeader
          id="projetos-title"
          eyebrow={projects.eyebrow}
          title={projects.title}
          aside={<div className={styles.desktopOnly}>{allLink}</div>}
        />
        <ul className={styles.track} aria-label="Lista de projetos em destaque" tabIndex={0}>
          {projects.items.map((p) => (
            <li key={p.title} className={`lift reveal ${styles.card}`}>
              <div className={`placeholder tone-${p.tone} ${styles.image}`}>[Imagem do projeto]</div>
              <div className={styles.body}>
                <span className={styles.status} data-status={p.status === 'Concluído' ? 'done' : 'active'}>
                  {p.status}
                </span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.text}>{p.summary}</p>
                <dl className={styles.meta}>
                  <div>
                    <dt>Coordenação:</dt> <dd>{p.coordination}</dd>
                  </div>
                  <div>
                    <dt>Financiamento:</dt> <dd>{p.funding}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.mobileOnly}>{allLink}</div>
      </div>
    </section>
  );
}
