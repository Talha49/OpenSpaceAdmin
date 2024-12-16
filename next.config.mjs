/** @type {import('next').NextConfig} */
const nextConfig = {  images: {
    domains: ['firebasestorage.googleapis.com'], // Allow Firebase Storage as a valid image domain
  },
};

export default nextConfig;
