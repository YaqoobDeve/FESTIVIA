// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      }, {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
