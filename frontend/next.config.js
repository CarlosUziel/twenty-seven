/** @type {import('next').NextConfig} */
const nextConfig = {
  // API rewrites to proxy backend requests
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
  
  // Optimize fonts to prevent fetch issues
  optimizeFonts: false,
  
  // Experimental features
  experimental: {
    // Additional optimizations can be added here
  },
};

module.exports = nextConfig;
