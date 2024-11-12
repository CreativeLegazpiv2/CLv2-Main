/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['vuvaenztnhuwfthtbxtf.supabase.co'], // Allow Supabase domain for images
      unoptimized: true, // Add this line if you want to use unoptimized images
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
  
};

export default nextConfig;