"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
      console.log("Header1");
      setUser(null);
      setLoading(false);
      return;
    }
    console.log("Header");
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
        setLoading(false);
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    }
    else{
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };
  return (
    <header className="sticky top-0 bg-white border-b z-[1000]">
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
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors cursor-pointer px-3 py-2"
                >
                  <span className="text-sm">{user.email}</span>
                  <svg
                    className={`h-4 w-4 ml-1 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-4 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1" role="menu">
                      <Link
                        href="/invite-records"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        邀请记录
                      </Link>

                      <Link
                        href="/reward-records"
                        onClick={() => setShowDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        奖励记录
                      </Link>
                      <button
                        onClick={(e) => {
                          console.log(e);
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
