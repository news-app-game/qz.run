"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getUser } from "@/tools/auth";
import { refreshInstance } from "@/tools/refresh-instance";
import { CaretDown } from "@phosphor-icons/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface User {
  email: string;
  admin_role: number;
}

export default function Header({ logined }: { logined: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logined) {
      setUser(null);
      setLoading(false);
      return;
    }
    const user = getUser();
    if (user) {
      setUser(user);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [logined]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    refreshInstance.logout();
    setUser(null);
    window.location.reload();
  };
  return (
    <header className="sticky top-0 bg-white border-b">
      <div className="max-w-[1024px] mx-auto px-6 h-16 flex">
        <Link href="/" className="flex-1 flex items-center gap-3 lg:mr-6">
          <Image src="/logo.png" alt="logo" width={32} className="select-none" height={32} />
          <span className="hidden font-bold lg:inline-block">
            {siteConfig.name}
          </span>
        </Link>


        {/* 备用不删 */}
        {/* <NavigationMenu> 
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/introduction" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    功能
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/price" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    价格
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/download" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    下载
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu> */}

        <div className="flex-1 flex items-center justify-end gap-2">
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {user.email}
                    <CaretDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link href="/invite-records">邀请记录</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/reward-records">奖励记录</Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="" onClick={handleLogout}>退出登录</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    登录
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">注册</Button>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}
