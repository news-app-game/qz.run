"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Configs {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function SignupForm({
  className,
  code,
  ...props
}: React.ComponentProps<"div"> & { code?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canSendCode, setCanSendCode] = useState(true);
  const [configs, setConfigs] = useState<Configs[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
    verificationCode: "",
  });
  const fetchConfigs = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-site-config`
      );
      const { data } = await response.json();
      setConfigs(data || []);

      // setMeta(configs.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "获取配置列表失败");
      setLoading(false);
    }
  };

  useEffect(() => {
    const inviteCode = code || '';
    setFormData({
      ...formData,
      inviteCode,
    });
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 表单验证
    if (!inviteCodeDisabled && !formData.inviteCode) {
      setError("请输入邀请码");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("请输入邮箱和密码");
      return;
    }

    if (!formData.verificationCode) {
      setError("请输入验证码");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("请输入正确的邮箱格式");
      return;
    }

    if (formData.password.length < 6 || formData.password.length > 20) {
      setError("密码长度必须在6-20个字符之间");
      return;
    }

    if (!formData.confirmPassword) {
      setError("请输入确认密码");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
            invite_code: formData.inviteCode,
            code: formData.verificationCode,
            register_source: 1,
          }),
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        // 注册成功，跳转到登录页
        toast.success(data.message);
        router.push("/login");
      } else {
        setError(data.message || "注册失败");
      }
    } catch (err) {
      console.log(err);
      setError("注册失败，请检查网络连接");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    if (!canSendCode) return;

    if (!validateEmail(formData.email)) {
      setError("请输入正确的邮箱格式");
      return;
    }

    setCanSendCode(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const data = await response.json();

      if (data.code === 200) {
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanSendCode(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setError("验证码已发送到您的邮箱");
      } else {
        setCanSendCode(true);
        setError(data.message || "验证码发送失败");
      }
    } catch (err) {
      console.log(err);
      setCanSendCode(true);
      setError("发送验证码失败，请检查网络连接");
    }
  };
  const inviteCodeDisabled = useMemo(() => {
    const regInviteCodeSwitch = configs.filter(
      (config) => config.key === "RegInviteCodeSwitch"
    )[0];
    if (!regInviteCodeSwitch) {
      return false;
    }
    return regInviteCodeSwitch.value === "off";
  }, [configs]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">注册轻舟</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="code">邀请码</Label>
                  <Input
                    id="code"
                    type="text"
                    required={!inviteCodeDisabled}
                    value={formData.inviteCode}
                    onChange={(e) =>
                      setFormData({ ...formData, inviteCode: e.target.value })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    还没有邀请码？
                    <Link
                      href="/invitation-code"
                      className="underline underline-offset-4"
                    >
                      点击获取
                    </Link>
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">密码</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password-confirm">确认密码</Label>
                  </div>
                  <Input
                    id="password-confirm"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="captcha">验证码</Label>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <Input
                      id="captcha"
                      type="text"
                      required
                      value={formData.verificationCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          verificationCode: e.target.value,
                        })
                      }
                    />
                    <Button
                      onClick={sendVerificationCode}
                      disabled={!canSendCode || loading}
                      variant="outline"
                    >
                      {canSendCode ? "发送验证码" : `${countdown}秒后重试`}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {loading ? "注册中..." : "注册"}
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
        点击注册，即表示您同意 <Link href="/terms-of-service">服务条款</Link> 和{" "}
        <Link href="/privacy">隐私政策</Link>。
      </div>
    </div>
  );
}
