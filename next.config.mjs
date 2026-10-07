/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep local secret files out of deployed server bundles
  outputFileTracingExcludes: { "*": [".env", ".env.*"] },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
