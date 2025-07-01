/** @type {import('next').NextConfig} */
const nextConfig = {
  // API rewrites to proxy backend requests
  async rewrites() {
    // Use environment variable for backend URL, default to localhost for development
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  
  // Expose BACKEND_URL to the client and server
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8000',
  },
  
  // Optimize fonts to prevent fetch issues
  optimizeFonts: false,
  
  // Experimental features
  experimental: {
    // Additional optimizations can be added here
  },
};

module.exports = nextConfig;
