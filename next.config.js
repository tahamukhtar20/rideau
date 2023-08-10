/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "picsum.photos",
      "images.unsplash.com",
      "cdn.sanity.io",
      "localhost",
      "flowbite.s3.amazonaws.com",
      "firebasestorage.googleapis.com",
      "via.placeholder.com",
    ],
  },
};

module.exports = nextConfig;
