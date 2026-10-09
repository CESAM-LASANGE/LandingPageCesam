import type { Noticia } from '@/content/noticias';
import { news } from '@/content/site';
import { NoticiaCard } from './NoticiaCard';
import { SectionHeader } from './SectionHeader';
import styles from './NoticiasLista.module.css';

/** Página /noticias/: todas as notícias já publicadas, da mais recente para a mais antiga. */
export function NoticiasLista({ lista }: { lista: Noticia[] }) {
  return (
    <section className="section" aria-labelledby="noticias-lista-title">
      <div className="container stack">
        <SectionHeader id="noticias-lista-title" eyebrow={news.eyebrow} title="Todas as notícias" as="h1" />
        {lista.length === 0 ? (
          <p className={styles.vazio}>Nenhuma notícia publicada ainda.</p>
        ) : (
          <ul className={styles.grade} aria-label="Notícias do CESAM">
            {lista.map((n) => (
              <li key={n.slug} className={styles.item}>
                <NoticiaCard
                  noticia={n}
                  sizes="(min-width: 1100px) 380px, (min-width: 700px) 45vw, calc(100vw - 32px)"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
