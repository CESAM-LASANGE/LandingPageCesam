import { galeriaSobre } from '@/content/galeria';
import { about } from '@/content/site';
import { Carousel } from './Carousel';
import { Foto } from './Foto';
import { Icon } from './Icon';
import styles from './About.module.css';

export function About() {
  return (
    <section id="sobre" className="section" aria-labelledby="sobre-title">
      <div className={`container ${styles.inner}`}>
        <div className={`reveal ${styles.photo}`}>
          {/* SPEC-002: carrossel de fotos do CESAM; sem fotos, volta o placeholder. */}
          <Carousel
            rotulo="Fotos do CESAM"
            variante="fotos"
            nomeItem="foto"
            itens={galeriaSobre.map((foto) => ({
              id: foto.arquivo,
              conteudo: (
                <figure className={styles.figura}>
                  <Foto
                    arquivo={foto.arquivo}
                    alt={foto.alt}
                    ajuste={foto.ajuste}
                    foco={foto.foco}
                    sizes="(min-width: 1100px) 540px, calc(100vw - 32px)"
                  />
                  {foto.legenda && <figcaption className={styles.legenda}>{foto.legenda}</figcaption>}
                </figure>
              ),
            }))}
            vazio={
              <div className={`placeholder placeholder--dashed ${styles.vazio}`}>
                <Icon name="photo" size={40} strokeWidth={1.5} />
                <span>{about.photo}</span>
              </div>
            }
          />
        </div>
        <div className={styles.copy}>
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 id="sobre-title" className="h2">
            {about.title}
          </h2>
          <p className={`lead ${styles.text}`}>{about.text}</p>
          <ul className={styles.pillars}>
            {about.pillars.map((p) => (
              <li key={p.title} className={styles.pillar}>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarText}>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
