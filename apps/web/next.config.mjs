/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverMinification: false,
  },
  serverExternalPackages: ['pino', 'pino-pretty'],
};

export default nextConfig;
