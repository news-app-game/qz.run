'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

function SendEmailForm({ onEmailSent }: { onEmailSent: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: 实现发送验证码逻辑
            console.log("发送验证码")
            // 模拟发送验证码
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(false)
                    onEmailSent()
                    resolve()
                }, 1000)
            })
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">重置密码</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="send-email-form" onSubmit={handleSendEmail}>
                    <div className="grid gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">邮箱</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="请输入您的注册邮箱"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                重置密码
                            </Button>
                        </div>
                        <Link href="/login" className="text-center text-sm underline underline-offset-4">
                            返回登录
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

function ResetSuccess() {
    const [countdown, setCountdown] = useState(3)
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setTimeout(() => {
                        router.push('/login')
                    }, 0)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">密码重置成功</CardTitle>
                <CardDescription>
                    密码已成功重置，{countdown} 秒后自动跳转到登录页面
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        立即跳转到登录页面
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

function ConfirmResetForm({ onResetSuccess }: { onResetSuccess: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: 实现重置密码逻辑
            console.log("重置密码")
            // 模拟重置密码
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(false)
                    onResetSuccess()
                    resolve()
                }, 1000)
            })
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-xl">密码重置</CardTitle>
                <CardDescription>请输入收到的6位验证码，验证码5分钟有效。</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="reset-password-form" onSubmit={handleConfirm}>
                    <div className="grid gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="verification-code">验证码</Label>
                                <Input
                                    id="verification-code"
                                    type="text"
                                    placeholder="请输入验证码"
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">新密码</Label>
                                <Input id="password" type="password" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password-confirm">确认新密码</Label>
                                <Input id="password-confirm" type="password" required />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    确认重置
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [emailSent, setEmailSent] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {resetSuccess ? (
                <ResetSuccess />
            ) : emailSent ? (
                <ConfirmResetForm onResetSuccess={() => setResetSuccess(true)} />
            ) : (
                <SendEmailForm onEmailSent={() => setEmailSent(true)} />
            )}
        </div>
    )
}

