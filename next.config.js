/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  compiler: {
    removeConsole: false,
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  reactStrictMode: false
}

module.exports = nextConfig
