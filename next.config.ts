import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Public avatar proxy used for creator profile images.
      { protocol: "https", hostname: "unavatar.io" },
    ],
  },
};

export default nextConfig;
