import type { NextConfig } from 'next';

// Export estático: o site institucional não exige backend próprio (ADR-001).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
