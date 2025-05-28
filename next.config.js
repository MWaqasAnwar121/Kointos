/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'resources.cryptocompare.com',
        pathname: '/news/**',
      },
      {
        protocol: 'https',
        hostname: 'images.cryptocompare.com',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig; 