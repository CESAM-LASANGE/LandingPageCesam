import type { MetadataRoute } from 'next';
import { hojeNoBuild, publicadas } from '@/content/noticias';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 },
    ...publicadas(hojeNoBuild()).map((n) => ({
      url: `${site.url}/noticias/${n.slug}/`,
      lastModified: n.data,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
