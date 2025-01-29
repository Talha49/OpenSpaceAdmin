/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
        port: "",
        pathname: "/**", // Allow all paths within this domain
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com", // Firebase Storage domain
        port: "",
        pathname: "/**", // Allow all paths within this domain
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Facebook platform domain
        port: "",
        pathname: "/**", // Allow all paths within this domain
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000", // You may want to adjust this based on your environment
          },
          // Add other necessary CORS headers if needed
        ],
      },
    ];
  },
};

export default nextConfig;
