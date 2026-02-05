/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // En demos comerciales es común no bloquear el deploy por lint.
  // Si preferís que falle en CI cuando hay errores, borrá esta sección.
  eslint: { ignoreDuringBuilds: true }
};
export default nextConfig;
