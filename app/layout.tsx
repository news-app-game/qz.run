import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/components/main";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className='antialiased'>
        <Header />
        <Main>
          {children}
        </Main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
