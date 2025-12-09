/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,  // Tambahkan ini
  },
  typescript: {
    ignoreBuildErrors: false,  // Tetap cek TypeScript
  },
}

module.exports = nextConfig