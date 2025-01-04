import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creatives Legazpi",
  description: "Cretives Legazpi world for creatives users",
  icons: {
    icon: {
      url: "/images/logo.png",
      type: "image/png",
      sizes: "64x64",
    },
  },
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  );
}
