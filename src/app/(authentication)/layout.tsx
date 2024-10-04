import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header
          roundedCustom="lg:rounded-bl-3xl"
          paddingLeftCustom="lg:pl-14"
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}