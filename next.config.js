/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Configuração de produção
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
}

module.exports = nextConfig