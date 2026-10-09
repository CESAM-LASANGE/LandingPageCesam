import type { Metadata, Viewport } from 'next';
import {
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Michroma,
  Public_Sans,
  Source_Sans_3,
  Space_Grotesk,
  Spectral,
} from 'next/font/google';
import { site } from '@/content/site';
import './globals.css';

const michroma = Michroma({ weight: '400', subsets: ['latin'], variable: '--font-michroma', display: 'swap' });
const spaceGrotesk = Space_Grotesk({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const sourceSans = Source_Sans_3({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});
const fraunces = Fraunces({ weight: '600', subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const publicSans = Public_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
});

// Identidade do Portal de Resíduos Sólidos (card em Plataformas). Sem preload: só aparecem abaixo da dobra.
const spectral = Spectral({
  weight: '600',
  subsets: ['latin'],
  variable: '--font-spectral',
  display: 'swap',
  preload: false,
});
const plexSans = IBM_Plex_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-plex-sans',
  display: 'swap',
  preload: false,
});

const title = `${site.name} · ${site.fullName} | ${site.institutionShort}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: '/images/og-cesam.png', width: 1200, height: 630, alt: `${site.name}, ${site.fullName}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
    images: ['/images/og-cesam.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#177A35' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const fonts = [michroma, spaceGrotesk, sourceSans, fraunces, publicSans, plexMono, spectral, plexSans]
    .map((f) => f.variable)
    .join(' ');
  return (
    <html lang="pt-BR" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
