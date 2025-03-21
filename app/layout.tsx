"use client";
import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Main from "@/components/main";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import moment from "moment";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      setIsLogin(false);
      return;
    } else {
      let decodedToken = jwtDecode(token) as { exp: number };

      console.log(
        moment(decodedToken.exp * 1000).format("YYYY-MM-DD HH:mm:ss")
      );
      console.log(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));
      console.log(decodedToken?.exp * 1000 < Date.now());

      if (!decodedToken) {
        setIsLogin(false);
        return;
      }
      else if(decodedToken?.exp*1000 < Date.now()){
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            if(response.data.code === 200) {
              localStorage.setItem("token", response.data.data.token);
              localStorage.setItem("user", JSON.stringify(response.data.data.user));
              axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;
              setIsLogin(true);
            }
          })
          .catch((error) => {
            console.error(error);
          })
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLogin(true);
    }
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
