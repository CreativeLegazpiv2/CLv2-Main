// components/layout/DashboardLayout.tsx

import { Footer } from "@/components/layout/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <Header
        menuItems={[
          { name: "Home", link: "/dashboard" },
          { name: "Profile", link: "/profile" },
          { name: "Gallery", link: "/gallery" },
        ]}
      /> */}
      <main className="bg-gray-100 min-h-screen p-4">{children}</main>
      <Footer />
    </div>
  );
}
