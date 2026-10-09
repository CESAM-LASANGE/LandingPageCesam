import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { News } from '@/components/News';
import { Platforms } from '@/components/Platforms';
import { Publications } from '@/components/Publications';
import { Research } from '@/components/Research';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Team } from '@/components/Team';
import { TopBar } from '@/components/TopBar';
import { contact, site } from '@/content/site';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: `${site.name} · ${site.fullName}`,
  alternateName: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/images/cesam-logo.png`,
  email: contact.email,
  telephone: '+55-67-3902-2547',
  address: { '@type': 'PostalAddress', addressLocality: 'Dourados', addressRegion: 'MS', addressCountry: 'BR' },
  hasMap: contact.mapa.href,
  parentOrganization: { '@type': 'CollegeOrUniversity', name: site.institution, url: 'https://www.uems.br' },
};

export default function HomePage() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <TopBar />
      <SiteHeader />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        {/* Faixa de números (components/Stats) desligada até haver números oficiais: SPEC-001 FR-05. */}
        <Platforms />
        <About />
        <Research />
        <News />
        <Team />
        {/* Seção "Projetos em destaque" (components/Projects) desligada por decisão da coordenação, 2026-10-08. */}
        <Publications />
        <Contact />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
