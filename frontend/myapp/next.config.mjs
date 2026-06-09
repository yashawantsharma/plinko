/** @type {import('next').NextConfig} */
const nextConfig = {
  
  output: 'export',
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;