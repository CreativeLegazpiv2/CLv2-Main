/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['vuvaenztnhuwfthtbxtf.supabase.co'], // Allow Supabase domain for images
      unoptimized: true, // Add this line if you want to use unoptimized images
    },
};

export default nextConfig;