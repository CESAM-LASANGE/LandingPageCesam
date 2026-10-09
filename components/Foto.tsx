import { fotoDoManifesto, srcSetDaFoto, urlDaFoto } from '@/lib/fotos';
import styles from './Foto.module.css';

type Props = {
  arquivo: string;
  alt: string;
  /** `cobrir` preenche o quadro; `conter` mostra a foto inteira sobre fundo desfocado. */
  ajuste?: 'cobrir' | 'conter';
  foco?: string;
  sizes: string;
  className?: string;
};

/** Foto otimizada do manifesto (ADR-003): srcset, dimensões e cor média para evitar layout shift. */
export function Foto({ arquivo, alt, ajuste = 'cobrir', foco, sizes, className }: Props) {
  const dados = fotoDoManifesto(arquivo);
  if (!dados) return null;
  const menor = dados.larguras[0]!;
  const comum = {
    srcSet: srcSetDaFoto(arquivo, dados),
    sizes,
    width: dados.largura,
    height: dados.altura,
    loading: 'lazy' as const,
    decoding: 'async' as const,
  };

  return (
    <div className={[styles.quadro, className].filter(Boolean).join(' ')} style={{ backgroundColor: dados.cor }}>
      {ajuste === 'conter' && (
        // eslint-disable-next-line @next/next/no-img-element -- export estático, imagem já otimizada
        <img
          src={urlDaFoto(arquivo, menor)}
          alt=""
          aria-hidden="true"
          className={styles.fundo}
          loading="lazy"
          decoding="async"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imagem já otimizada */}
      <img
        {...comum}
        src={urlDaFoto(arquivo, dados.larguras[Math.min(1, dados.larguras.length - 1)]!)}
        alt={alt}
        className={ajuste === 'conter' ? styles.conter : styles.cobrir}
        style={foco ? { objectPosition: foco } : undefined}
      />
    </div>
  );
}
