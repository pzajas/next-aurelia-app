import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 750, 828, 1080, 1200],
    imageSizes: [256, 384, 512, 640, 750],
    qualities: [75, 80, 82, 85],
  },
};

export default nextConfig;
