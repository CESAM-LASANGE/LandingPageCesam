import type { Metadata } from 'next';
import { NoticiasLista } from '@/components/NoticiasLista';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TopBar } from '@/components/TopBar';
import { hojeNoBuild, publicadas } from '@/content/noticias';
import { site } from '@/content/site';

const titulo = `Notícias · ${site.name}`;
const descricao = `Cursos, defesas e atividades de extensão do ${site.name}, ${site.fullName} da ${site.institutionShort}.`;

export const metadata: Metadata = {
  title: titulo,
  description: descricao,
  alternates: { canonical: '/noticias/' },
  openGraph: { type: 'website', title: titulo, description: descricao },
  twitter: { card: 'summary_large_image', title: titulo, description: descricao },
};

export default function NoticiasPage() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <TopBar />
      <SiteHeader base="/" />
      <main id="conteudo" tabIndex={-1}>
        <NoticiasLista lista={publicadas(hojeNoBuild())} />
      </main>
      <SiteFooter base="/" />
    </>
  );
}
