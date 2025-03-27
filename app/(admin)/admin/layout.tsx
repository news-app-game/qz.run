'use client';

import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ArrowLeft, Bell, Gift, History, Home, HelpCircle, LucideProps, Network, Ticket, UserPlus, Users, Cog, MapPinned, Link2Icon } from 'lucide-react';
import Link from 'next/link';
import * as react from "react";
import { useEffect, useState } from 'react';

type SidebarItem = {
  title: string
  url: string
  icon: react.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>
}

const items: SidebarItem[] = [
  {
    title: "控制台",
    url: "/admin",
    icon: Home,
  },
  {
    title: "用户管理",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "邀请码",
    url: "/admin/invite-codes",
    icon: Ticket,
  },
  {
    title: "邀请记录",
    url: "/admin/invite-records",
    icon: UserPlus,
  },
  {
    title: "奖励记录",
    url: "/admin/rewards-records",
    icon: Gift,
  },
  {
    title: "节点列表",
    url: "/admin/nodes",
    icon: Network,
  },
  {
    title: "区域管理",
    url: "/admin/nodes-loc",
    icon: MapPinned,
  },
  {
    title: "系统配置",
    url: "/admin/site-configs",
    icon: Cog,
  },
  {
    title: "公告管理",
    url: "/admin/announcements",
    icon: Bell,
  },

  {
    title: "版本记录",
    url: "/admin/versions",
    icon: History,
  },
  {
    title: "连接日志",
    url: "/admin/connection-logs",
    icon: Link2Icon,
  },
  {
    title: "用户反馈",
    url: "/admin/feedbacks",
    icon: HelpCircle,
  },
];

const SidebarMenuLink = ({ item }: { item: SidebarItem }) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <Link href={item.url} onClick={() => setOpenMobile(false)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground">
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 检查是否是管理员
    const checkAdmin = () => {
      try {
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin check failed:', error);
      }
    };

    checkAdmin();
  }, []);

  // 如果未认证为管理员，显示加载状态
  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="pl-4 p-6">
              <h1 className="text-xl font-semibold">后台管理系统</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuLink item={item} key={item.title} />
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* 主要内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-card">
            <div className="h-full px-6 flex items-center justify-between">
              <Link href="/" className="flex-1 flex items-center gap-3 lg:mr-6 md:hidden">
                <Image src="/logo.png" alt="logo" width={32} className="select-none" height={32} />
              </Link>
              <h2 className="text-lg font-medium"></h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>返回首页</span>
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-[1920px]">
              {children}
            </div>
          </main>
        </div>
        {/* <Toaster /> */}
      </SidebarProvider>
    </div>
  );
}
