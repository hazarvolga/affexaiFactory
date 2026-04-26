/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@affex/observability-core',
    '@affex/ai-core',
    '@affex/shared-types',
    '@affex/ui-kit',
    '@affex/design-tokens',
  ],
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@node-rs/argon2', '@affex/auth-core'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@node-rs/argon2', '@affex/auth-core');
    }
    return config;
  },
};

export default nextConfig;
