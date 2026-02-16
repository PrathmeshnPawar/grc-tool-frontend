import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // When your frontend calls /api/..., Next.js will "mask" it
        source: "/api/:path*",
        // This points to your Spring Boot server
        destination: "http://localhost:8085/api/:path*", 
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Senior Tip: Use a wildcard for all Google subdomains
        port: '',
        pathname: '**', // Allow all paths
      },
    ],
  },
};

export default nextConfig;
