import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.staticmb.com",
        pathname: "/**", // Allows all paths under the domain
      },
    ],
  },
};

export default nextConfig;
