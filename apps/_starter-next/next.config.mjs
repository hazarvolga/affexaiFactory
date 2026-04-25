/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@affex/observability-core', '@affex/ai-core', '@affex/shared-types'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
