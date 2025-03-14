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
import { Textarea } from "@/components/ui/textarea"

export function FeedbackForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">问题反馈</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱，方便我们联系您"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="version">软件版本（选填）</Label>
                  </div>
                  <Input id="version" type="text" placeholder="例如：v1.0.0"/>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="platform">使用平台（选填）</Label>
                  </div>
                  <Input id="platform" type="text" placeholder="例如：Windows 10" />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="feedback-content">反馈内容</Label>
                  </div>
                  <Textarea id="feedback-content" placeholder="请详细描述您的问题或建议" required />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="screenshot">截图（选填，最多5张）</Label>
                  </div>
                  <Input id="screenshot" type="file" multiple accept="image/*" />
                </div>
                <Button type="submit" className="w-full">
                  提交
                </Button>
              </div>
              <div className="text-center text-sm">
                遇到问题?{" "}
                <Link href="/help-center" className="underline underline-offset-4">
                  前往帮助中心
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
