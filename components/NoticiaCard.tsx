import { dataCurta, ROTULO_CATEGORIA, type Noticia } from '@/content/noticias';
import { Foto } from './Foto';
import styles from './NoticiaCard.module.css';

type Props = {
  noticia: Noticia;
  /** `destaque`: card horizontal, usado quando é a única notícia. */
  variante?: 'padrao' | 'destaque';
  sizes: string;
  /** Nível do título (h3 na home; h3 também em "Outras notícias"). */
  className?: string;
};

/** Card de notícia: o card inteiro é um link para a página (stretched link no título). */
export function NoticiaCard({ noticia, variante = 'padrao', sizes, className }: Props) {
  return (
    <article className={[styles.card, styles[variante], 'lift', className].filter(Boolean).join(' ')}>
      <div className={styles.imagem}>
        <Foto arquivo={noticia.capa.arquivo} alt={noticia.capa.alt} foco={noticia.capa.foco} sizes={sizes} />
      </div>
      <div className={styles.corpo}>
        <p className={styles.meta}>
          <span className={styles.categoria}>{ROTULO_CATEGORIA[noticia.categoria]}</span>
          <time dateTime={noticia.data}>{dataCurta(noticia.data)}</time>
        </p>
        <h3 className={styles.titulo}>
          <a href={`/noticias/${noticia.slug}/`} className={styles.link}>
            {noticia.titulo}
          </a>
        </h3>
        <p className={styles.resumo}>{noticia.resumo}</p>
        <span className={styles.ler} aria-hidden="true">
          Ler notícia <span className="go">→</span>
        </span>
      </div>
    </article>
  );
}
