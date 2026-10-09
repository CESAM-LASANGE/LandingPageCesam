import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NoticiaArtigo } from '@/components/NoticiaArtigo';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TopBar } from '@/components/TopBar';
import { hojeNoBuild, publicadas } from '@/content/noticias';
import { site } from '@/content/site';
import { fotoDoManifesto } from '@/lib/fotos';

type Props = { params: Promise<{ slug: string }> };

// Site estático: só as páginas listadas aqui existem; qualquer outro endereço é 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return publicadas(hojeNoBuild()).map((n) => ({ slug: n.slug }));
}

function buscar(slug: string) {
  return publicadas(hojeNoBuild()).find((n) => n.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const noticia = buscar(slug);
  if (!noticia) return {};
  const capa = fotoDoManifesto(noticia.capa.arquivo);
  const largura = capa?.larguras.at(-1);
  const imagem =
    capa && largura
      ? [{ url: `/midia/${noticia.capa.arquivo}-${largura}.webp`, width: largura, alt: noticia.capa.alt }]
      : undefined;
  const titulo = `${noticia.titulo} · Notícias · ${site.name}`;
  return {
    title: titulo,
    description: noticia.resumo,
    alternates: { canonical: `/noticias/${noticia.slug}/` },
    openGraph: {
      type: 'article',
      title: titulo,
      description: noticia.resumo,
      publishedTime: noticia.data,
      images: imagem,
    },
    twitter: { card: 'summary_large_image', title: titulo, description: noticia.resumo },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const noticia = buscar(slug);
  if (!noticia) notFound();

  const outras = publicadas(hojeNoBuild()).filter((n) => n.slug !== noticia.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: noticia.titulo,
    description: noticia.resumo,
    datePublished: noticia.data,
    inLanguage: 'pt-BR',
    mainEntityOfPage: `${site.url}/noticias/${noticia.slug}/`,
    publisher: { '@type': 'Organization', name: `${site.name} · ${site.fullName}`, url: site.url },
  };

  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <TopBar />
      <SiteHeader base="/" />
      <main id="conteudo" tabIndex={-1}>
        <NoticiaArtigo noticia={noticia} outras={outras} />
      </main>
      <SiteFooter base="/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
