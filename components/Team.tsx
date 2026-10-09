import { team } from '@/content/site';
import { Foto } from './Foto';
import { SectionHeader } from './SectionHeader';
import { SmartLink } from './SmartLink';
import styles from './Team.module.css';

export function Team() {
  const allLink = (
    <SmartLink link={team.all} className="more">
      {team.all.label} <span className="go">→</span>
    </SmartLink>
  );
  return (
    <section id="equipe" className="section section--alt" aria-labelledby="equipe-title">
      <div className="container stack">
        <SectionHeader
          id="equipe-title"
          eyebrow={team.eyebrow}
          title={team.title}
          aside={<div className={styles.desktopOnly}>{allLink}</div>}
        />
        <div className={styles.layout}>
          <div className={styles.leads}>
            {team.coordinators.map((pessoa) => (
              <article key={pessoa.name} className={`lift reveal ${styles.lead}`}>
                {pessoa.photo ? (
                  <Foto
                    arquivo={pessoa.photo}
                    alt={`Foto de ${pessoa.name}`}
                    foco={pessoa.focus}
                    sizes="(min-width: 1100px) 300px, (min-width: 700px) 45vw, 88px"
                    className={styles.leadPhoto}
                  />
                ) : (
                  <div className={`placeholder ${styles.leadPhoto}`}>[Foto]</div>
                )}
                <div className={styles.leadBody}>
                  <p className={styles.leadEyebrow}>{pessoa.role}</p>
                  <h3 className={styles.leadName}>{pessoa.name}</h3>
                  <p className={styles.leadDetails}>
                    {pessoa.degree}
                    <span className={styles.leadArea}>{pessoa.area}</span>
                  </p>
                  <SmartLink link={pessoa.lattes} className={styles.lattes}>
                    {pessoa.lattes.label} <span className="visually-hidden">de {pessoa.name}</span>{' '}
                    <span aria-hidden="true">↗</span>
                  </SmartLink>
                </div>
              </article>
            ))}
          </div>
          <ul className={styles.grid} aria-label="Integrantes do CESAM">
            {team.members.map((m) => {
              const conteudo = (
                <>
                  {m.photo ? (
                    <Foto
                      arquivo={m.photo}
                      alt={`Foto de ${m.name}`}
                      foco={m.focus}
                      sizes="72px"
                      className={styles.avatar}
                    />
                  ) : (
                    <span className={`${styles.avatar} ${styles[m.tone]}`} aria-hidden="true" />
                  )}
                  <div className={styles.memberBody}>
                    <h3 className={styles.memberName}>{m.name}</h3>
                    <p className={styles.memberRole}>{m.role}</p>
                  </div>
                </>
              );
              return (
                <li key={m.name} className={styles.memberItem}>
                  {m.lattes ? (
                    <a
                      href={m.lattes}
                      target="_blank"
                      aria-label={`${m.name}, ${m.role}. Currículo Lattes, abre em nova aba`}
                      rel="noopener noreferrer"
                      className={`lift reveal ${styles.member} ${styles.memberLink}`}
                    >
                      {conteudo}
                      <span className={styles.memberGo} aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <div className={`lift reveal ${styles.member}`}>{conteudo}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.mobileOnly}>{allLink}</div>
      </div>
    </section>
  );
}
