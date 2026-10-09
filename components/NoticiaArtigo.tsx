import Link from 'next/link';
import { dataPorExtenso, ROTULO_CATEGORIA, type FotoNoticia, type Noticia } from '@/content/noticias';
import { fotoDoManifesto } from '@/lib/fotos';
import { Foto } from './Foto';
import { NoticiaCard } from './NoticiaCard';
import styles from './NoticiaArtigo.module.css';

type Props = {
  noticia: Noticia;
  /** Outras notícias publicadas, sem a atual, da mais recente para a mais antiga. */
  outras: Noticia[];
};

/** `natural`: mantém o formato da foto (flex, mesma altura entre fotos). `quadro`: tile 4:3 de grade. */
function Figura({
  foto,
  sizes,
  className,
  modo = 'natural',
}: {
  foto: FotoNoticia;
  sizes: string;
  className?: string;
  modo?: 'natural' | 'quadro';
}) {
  const dados = fotoDoManifesto(foto.arquivo);
  const proporcao = dados ? dados.largura / dados.altura : 4 / 3;
  const natural = modo === 'natural';
  return (
    <figure
      className={[styles.figura, className].filter(Boolean).join(' ')}
      style={natural ? { flexGrow: proporcao } : undefined}
    >
      <div className={styles.foto} style={{ aspectRatio: natural ? String(proporcao) : '4 / 3' }}>
        <Foto arquivo={foto.arquivo} alt={foto.alt} ajuste={foto.ajuste} foco={foto.foco} sizes={sizes} />
      </div>
      {foto.legenda && <figcaption className={styles.legenda}>{foto.legenda}</figcaption>}
    </figure>
  );
}

/** Conteúdo da página de uma notícia (SPEC-007 FR-03). Cabeçalho e rodapé do site ficam na rota. */
export function NoticiaArtigo({ noticia, outras }: Props) {
  const maisNoticias = outras.slice(0, 3);

  return (
    <article className={styles.artigo}>
      <div className={`container ${styles.container}`}>
        <nav aria-label="Trilha de navegação" className={styles.trilha}>
          <Link href="/">Início</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/noticias/">Notícias</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className={styles.atual}>
            {noticia.titulo}
          </span>
        </nav>

        <header className={styles.cabecalho}>
          <p className={styles.meta}>
            <span className={styles.categoria}>{ROTULO_CATEGORIA[noticia.categoria]}</span>
            <time dateTime={noticia.data}>{dataPorExtenso(noticia.data)}</time>
          </p>
          <h1 className={styles.titulo}>{noticia.titulo}</h1>
          <p className={styles.resumo}>{noticia.resumo}</p>
        </header>

        <Figura foto={noticia.capa} sizes="(min-width: 1100px) 1080px, 100vw" className={styles.capa} />

        <div className={styles.texto}>
          {noticia.corpo.map((bloco, i) =>
            bloco.tipo === 'titulo' ? (
              <h2 key={i} className={styles.subtitulo}>
                {bloco.texto}
              </h2>
            ) : (
              <p key={i}>{bloco.texto}</p>
            ),
          )}
        </div>

        {noticia.galeria && noticia.galeria.length > 0 && (
          // Até 2 fotos: lado a lado, no formato natural. 3 ou mais: grade de quadros 4:3, com fotos em pé inteiras.
          <div
            className={noticia.galeria.length <= 2 ? styles.galeria : styles.grade}
            data-quantidade={noticia.galeria.length}
          >
            {noticia.galeria.map((foto) => (
              <Figura
                key={foto.arquivo}
                foto={foto}
                modo={noticia.galeria!.length <= 2 ? 'natural' : 'quadro'}
                sizes="(min-width: 900px) 540px, 100vw"
              />
            ))}
          </div>
        )}

        <p className={styles.voltar}>
          <Link href="/noticias/" className="more">
            <span aria-hidden="true">←</span> Voltar para as notícias
          </Link>
        </p>
      </div>

      {maisNoticias.length > 0 && (
        <section className={styles.outras} aria-labelledby="outras-titulo">
          <div className="container">
            <h2 id="outras-titulo" className={styles.outrasTitulo}>
              Outras notícias
            </h2>
            <ul className={styles.outrasLista} role="list">
              {maisNoticias.map((n) => (
                <li key={n.slug}>
                  <NoticiaCard noticia={n} sizes="(min-width: 900px) 380px, 100vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
