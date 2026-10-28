/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@keystatic/core", "@keystatic/next"],
  images: {
    // Local images are cache-keyed on their content hash, so a long TTL is
    // safe: replacing a file still busts the cache. The Next 14 default is
    // 60s, which re-bills a Vercel transformation + cache write every minute.
    minimumCacheTTL: 2678400, // 31 days
    // Nothing on the site renders wider than ~1500px; drop the 2048/3840
    // candidates so retina screens stop requesting near-full-size variants.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

module.exports = nextConfig;
