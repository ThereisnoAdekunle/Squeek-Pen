import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const config: NextConfig = {
  // Static export + relative asset prefix are for the production build only.
  // In dev they stop the JS chunks and the HMR websocket from loading.
  ...(isProd ? { output: "export" as const, assetPrefix: "." } : {}),
  images: { unoptimized: true },
  poweredByHeader: false,
  // Only needed if you open the dev site by IP instead of localhost.
  allowedDevOrigins: ["192.168.56.1"],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@farcaster/mini-app-solana": false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};
export default config;