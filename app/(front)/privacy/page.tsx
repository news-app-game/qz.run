import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Privacy() {
    return (
        <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-start gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader className="text-center flex flex-col gap-2">
                        <CardTitle className="text-2xl">隐私政策</CardTitle>
                        <CardDescription>最后更新：2025年3月13日</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">1. 信息收集</h3>
                                <p className="text-muted-foreground">轻舟 VPN 不会 记录您的浏览历史、IP 地址、DNS 查询或任何网络活动。 我们仅收集以下必要信息：</p>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>账户信息：注册时提供的电子邮件地址（如适用）</li>
                                    <li>支付信息：由第三方支付处理商管理，我们不存储您的支付详情。</li>
                                    <li>技术数据：设备类型、应用程序崩溃日志（用于改进服务）。</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">2. 我们如何使用您的信息</h3>
                                <ul className="list-disc pl-6 text-muted-foreground">
                                    <li>提供和维护 VPN 服务</li>
                                    <li>处理付款（如果适用）</li>
                                    <li>改进产品体验和技术支持</li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-medium">3. 信息共享</h3>
                                <p className="text-muted-foreground">我们不会与任何第三方共享或出售您的个人数据。如法律要求，我们仅在收到英国相关法律机构的合法请求时提供必要的信息。</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-medium">4. 数据安全</h3>
                                <p className="text-muted-foreground">我们采用 强加密技术 保护您的数据，所有连接均经过“无日志”服务器处理，最大程度保障隐私。</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-medium">5. 您的权利</h3>
                                <p className="text-muted-foreground">您可以随时请求访问、更正或删除您的账户数据。</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-medium">6. 联系我们</h3>
                                <p className="text-muted-foreground">如有任何隐私问题，请通过 <a href="mailto:privacy@qz.run" className="text-primary">privacy#qz.run</a> 联系我们。</p>
                            </div>
                            <p className="text-center text-sm text-muted-foreground">轻舟 VPN 让您的互联网更自由、更安全。</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}