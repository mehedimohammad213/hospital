/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Enable static export
  // trailingSlash: true, // Add trailing slashes for better cPanel compatibility
  // distDir: 'out', // Output directory for static files
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sajedabackend.etherstaging.xyz',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig

