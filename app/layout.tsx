"use client";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/components/main";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { refreshInstance } from "@/tools/refresh-instance";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {
      const token = await refreshInstance.getToken();
      if (token) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    checkLogin();
  }, []);


  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Header logined={isLogin} />
        <Main>{children}</Main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
