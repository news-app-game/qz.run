"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { toast } from "sonner";
import { login } from "@/api/user";
import { setUser } from "@/tools/auth";
import { refreshInstance } from '@/tools/refresh-instance';
import { Loader2 } from "lucide-react"
import { useState } from "react"
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    setIsLoading(true);
    login({
      email,
      password
    })
      .then(({ code, data, message }) => {
        console.log('login', code, data, message);
        if (code === 200) {
          refreshInstance.setToken(data.token);
          setUser(data.user);
          toast.success(message);
          window.location.href = '/';
        }
      })
      .catch((error) => {
        if (error.message) {
          toast.error(error.message)
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">登录轻舟</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">密码</Label>
                    <Link href="/reset-password">
                      <div className="text-muted-foreground text-sm underline underline-offset-4">忘记密码?</div>
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="animate-spin" />}
                  登录
                </Button>
              </div>
              <div className="text-center text-sm">
                没有账号?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  注册
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        点击登录，即表示您同意 <Link href="/terms-of-service">服务条款</Link> 和 <Link href="/privacy">隐私政策</Link>。
      </div>
    </div>
  )
}
