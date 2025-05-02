// import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  env: {
    DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,
  },
};

export default nextConfig;
