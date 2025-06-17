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
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
  swcMinify: false,
  reactStrictMode: false
}

module.exports = nextConfig
