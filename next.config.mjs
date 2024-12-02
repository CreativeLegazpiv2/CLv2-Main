/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['vuvaenztnhuwfthtbxtf.supabase.co'],
    // Remove unoptimized: true to enable Next.js image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vuvaenztnhuwfthtbxtf.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'gsap'],
    scrollRestoration: true,
    strictNextHead: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true,
  // For better performance with Supabase
  output: 'standalone',
  generateEtags: false,
};

export default nextConfig;