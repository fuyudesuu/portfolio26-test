/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // IMPORTANT: Replace 'portfolio-site' with your actual GitHub repo name.
  // If deploying to https://username.github.io (root), remove both lines below.
  basePath: "/portfolio-site",
  assetPrefix: "/portfolio-site",

  // GitHub Pages doesn't support Next.js image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
