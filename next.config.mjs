/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow CSS with custom properties from old design system
  experimental: {
    optimizeCss: false,
  },
}

export default nextConfig
