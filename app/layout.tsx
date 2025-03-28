import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "轻舟 - 安全的VPN",
  description: "轻舟是一个安全、快速、便捷的VPN",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    images: [
      {
        url: "/og.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
