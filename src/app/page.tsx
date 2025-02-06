// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
 
  useEffect(() => {
    // Trigger client-side navigation on load
    router.push('/home'); // Replace with your target route
  }, [router]);

  return null;
}
