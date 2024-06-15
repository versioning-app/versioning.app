/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverMinification: false,
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
};

export default nextConfig;
