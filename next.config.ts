import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 npm run build  → fully static site in /out (any static host).
 * Default build → standard Next.js server output (Vercel, Render, Railway, Node).
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    qualities: [70, 75, 85],
    formats: ["image/avif", "image/webp"],
    // Remote image domains are intentionally not configured — every asset is local.
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
