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

export function SignupForm({
  className,
  code,
  ...props
}: React.ComponentProps<"div"> & { code?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">注册轻舟</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="code">邀请码</Label>
                  <Input
                    id="code"
                    type="text"
                    required
                    defaultValue={code}
                  />
                  <p className="text-sm text-muted-foreground">还没有邀请码？<Link href="/invitation-code" className="underline underline-offset-4">点击获取</Link></p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password-confirm">确认密码</Label>
                  </div>
                  <Input id="password-confirm" type="password" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="captcha">验证码</Label>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <Input id="captcha" type="text" required />
                    <Button type="submit" variant="outline">获取验证码</Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  注册
                </Button>
              </div>
              <div className="text-center text-sm">
                已有账号?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  登录
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        点击注册，即表示您同意 <Link href="/terms-of-service">服务条款</Link> 和 <Link href="/privacy">隐私政策</Link>。
      </div>
    </div>
  )
}
