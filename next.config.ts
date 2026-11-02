import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  assetPrefix: ".",
  images: { unoptimized: true },
  poweredByHeader: false,
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
