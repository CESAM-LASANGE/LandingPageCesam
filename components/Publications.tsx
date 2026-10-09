'use client';

import { Fragment, useState } from 'react';
import { publicacoes, type TipoPublicacao } from '@/content/publicacoes';
import { publications } from '@/content/site';
import { SectionHeader } from './SectionHeader';
import styles from './Publications.module.css';

type Filtro = TipoPublicacao | 'todas';

/** Quantas aparecem antes de "Mostrar todas" (SPEC-006). */
const RECENTES = 5;

const ROTULOS_FILTRO: Record<TipoPublicacao, string> = { artigo: 'Artigos', livro: 'Livros', evento: 'Eventos' };

// Só os tipos que têm publicações viram filtro, na ordem de ROTULOS_FILTRO.
const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  ...(Object.keys(ROTULOS_FILTRO) as TipoPublicacao[])
    .filter((tipo) => publicacoes.some((p) => p.tipo === tipo))
    .map((tipo) => ({ valor: tipo, rotulo: ROTULOS_FILTRO[tipo] })),
];

const anos = publicacoes.map((p) => p.ano);
const periodo = `${Math.min(...anos)}–${Math.max(...anos)}`;

export function Publications() {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [expandido, setExpandido] = useState(false);

  const filtradas = filtro === 'todas' ? publicacoes : publicacoes.filter((p) => p.tipo === filtro);
  const visiveis = expandido ? filtradas : filtradas.slice(0, RECENTES);
  const total = filtradas.length;
  const status =
    visiveis.length === total
      ? `${total} ${total === 1 ? 'publicação' : 'publicações'}`
      : `${visiveis.length} de ${total} publicações`;

  return (
    <section id="publicacoes" className="section" aria-labelledby="publicacoes-title">
      <div className={`container stack ${styles.stack}`}>
        <SectionHeader
          id="publicacoes-title"
          eyebrow={publications.eyebrow}
          title={publications.title}
          aside={
            <p className={styles.resumo}>
              {publicacoes.length} trabalhos com integrantes do CESAM · {periodo}
            </p>
          }
        />
        <div className={styles.filters} role="group" aria-label="Filtrar publicações por tipo">
          {filtros.map((f) => (
            <button
              key={f.valor}
              type="button"
              className={styles.filter}
              aria-pressed={filtro === f.valor}
              onClick={() => setFiltro(f.valor)}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
        <p className="visually-hidden" role="status">
          {status}
        </p>
        <ul className={styles.list} aria-label="Publicações do CESAM">
          {visiveis.map((p) => (
            <li key={p.doi} className={styles.item}>
              <span className={styles.year}>{p.ano}</span>
              <div className={styles.body}>
                <span className={styles.type}>{p.tipoRotulo}</span>
                <h3 className={styles.title}>{p.titulo}</h3>
                <p className={styles.authors}>
                  {p.autores.map((a, i) => (
                    <Fragment key={`${a.nome}-${i}`}>
                      {i > 0 && '; '}
                      {a.cesam ? <strong className={styles.cesam}>{a.nome}</strong> : a.nome}
                    </Fragment>
                  ))}
                  {p.veiculo && (
                    <>
                      {' · '}
                      <i>{p.veiculo}</i>
                    </>
                  )}
                </p>
              </div>
              <a
                href={p.pdf ?? `https://doi.org/${p.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.doi}
                aria-label={`${p.pdf ? 'PDF' : 'Página do artigo'}: ${p.titulo} (abre em nova aba)`}
              >
                {p.pdf ? 'PDF' : 'Artigo'} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        {total > RECENTES && (
          <div>
            <button
              type="button"
              className={`more ${styles.expandir}`}
              aria-expanded={expandido}
              onClick={() => setExpandido((v) => !v)}
            >
              {expandido ? 'Mostrar só as mais recentes' : `Mostrar todas as ${total} publicações`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
