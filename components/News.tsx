import Link from 'next/link';
import { hojeNoBuild, publicadas, type Noticia } from '@/content/noticias';
import { news } from '@/content/site';
import { Carousel } from './Carousel';
import { NoticiaCard } from './NoticiaCard';
import { SectionHeader } from './SectionHeader';
import styles from './News.module.css';

type Props = {
  /** Notícias a mostrar; por padrão, as já publicadas na data do build. */
  lista?: Noticia[];
};

/** Quantas notícias entram no carrossel da home (SPEC-007 FR-01). */
const NO_CARROSSEL = 6;

export function News({ lista = publicadas(hojeNoBuild()) }: Props) {
  const itens = lista.slice(0, NO_CARROSSEL);
  const poucas = itens.length <= 3;

  return (
    <section id="noticias" className="section" aria-labelledby="noticias-title">
      <div className="container stack">
        <SectionHeader
          id="noticias-title"
          eyebrow={news.eyebrow}
          title={news.title}
          aside={
            lista.length > 0 && (
              <Link href="/noticias/" className="more">
                Ver todas as notícias <span className="go">→</span>
              </Link>
            )
          }
        />
        {itens.length === 0 ? (
          <p className={styles.vazio}>Nenhuma notícia publicada ainda.</p>
        ) : (
          <Carousel
            rotulo="Notícias do CESAM"
            variante="cards"
            nomeItem="notícia"
            // Com até 3 notícias, 3 cards caberiam juntos e não haveria troca: mostra uma por vez, em destaque.
            itensPorVez={poucas ? 1 : undefined}
            itens={itens.map((n) => ({
              id: n.slug,
              conteudo: poucas ? (
                <NoticiaCard noticia={n} variante="destaque" sizes="(min-width: 900px) 560px, calc(100vw - 32px)" />
              ) : (
                <NoticiaCard noticia={n} sizes="(min-width: 1100px) 380px, (min-width: 700px) 45vw, 90vw" />
              ),
            }))}
          />
        )}
      </div>
    </section>
  );
}
