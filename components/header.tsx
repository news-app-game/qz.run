'use client'

import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
    return (
        <header className="sticky top-0 bg-white border-b">
            <div className="max-w-[1024px] mx-auto px-6 h-16 flex">
                <Link href="/" className="flex-1 flex items-center gap-3 lg:mr-6">
                    <Image src="/logo.png" alt="logo" width={32} height={32} />
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
                    <Link href="/login">
                        <Button variant="ghost" size="sm">登录</Button>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm">注册</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}