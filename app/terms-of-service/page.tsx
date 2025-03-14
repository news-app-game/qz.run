import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-start gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader className="text-center flex flex-col gap-2">
                        <CardTitle className="text-2xl">服务条款</CardTitle>
                        <CardDescription>最后更新：2025年3月13日</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full flex flex-col gap-6">
                            <p className="text-secondary-foreground">欢迎使用轻舟VPN（以下简称“我们”或“本服务”）。在使用本服务前，请仔细阅读以下协议。使用我们的服务即表示您同意本协议的所有条款。</p>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">1. 服务说明</h3>
                                <p className="text-muted-foreground">轻舟 VPN 提供加密网络连接，帮助您保护隐私和提升网络安全。我们不对您的网络活动承担责任。</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">2. 账户与使用</h3>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>您必须遵守适用法律，不得利用本服务从事非法活动。</li>
                                    <li>您对自己的账户和密码安全负责，不得与他人共享账户。</li>
                                    <li>我们保留因违反本协议而暂停或终止服务的权利。</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">3. 禁止行为</h3>
                                <p className="text-muted-foreground">您不得利用本服务：</p>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>进行黑客攻击、分发恶意软件、发送垃圾邮件等非法行为</li>
                                    <li>侵犯版权、进行欺诈、传播仇恨言论或非法内容</li>
                                    <li>试图破坏或滥用我们的服务器或网络资源</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">4. 隐私政策</h3>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>我们承诺不记录您的浏览历史、IP 地址或网络活动，详见 <Link href="/privacy" className="text-primary">隐私政策</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">5. 免责声明</h3>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>本服务按“现状”提供，不保证无故障运行或完全匿名</li>
                                    <li>我们不对第三方网站或服务的行为负责</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">6. 责任限制</h3>
                                <p className="text-muted-foreground">对于因使用或无法使用本服务导致的任何损失，我们不承担责任</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">7. 终止与退款</h3>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>您可以随时取消服务。</li>
                                    <li>若违反本协议，我们有权终止您的账户，且不予退款</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">8. 联系方式</h3>
                                <p className="text-muted-foreground">如有问题，请联系：
                                    <Link href="mailto:support@qz.run" className="text-primary">support#qz.run</Link>
                                </p>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">使用轻舟 VPN，即代表您同意本协议的所有条款。</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}