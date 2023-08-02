/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "picsum.photos",
      "images.unsplash.com",
      "cdn.sanity.io",
      "localhost",
    ],
  },
};

module.exports = nextConfig;
