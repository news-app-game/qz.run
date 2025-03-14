import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

export default function HelpCenter() {
    return (
        <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-start gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader className="text-center flex flex-col gap-2">
                        <CardTitle className="text-xl">如何检测系统类型？</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium">要确认您的 Windows 电脑使用的是 x64、ARM64 还是 x86 (32位) 处理器：</h3>
                            <ol className="list-decimal pl-6 text-sm">
                                <li>打开系统信息工具。按下<code className="text-sm bg-slate-100 px-1 rounded text-primary">Win + R</code>， 输入<code className="text-sm bg-slate-100 px-1 rounded text-primary">msinfo32</code>，然后点击Enter</li>
                                <li>转到系统摘要 → 系统类型， 您将看到系统架构信息</li>
                            </ol>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium">要确认您的 Mac 电脑使用的是 Intel 还是 Apple Silicon 处理器：</h3>
                            <ol className="list-decimal pl-6 text-sm">
                                <li>点击屏幕左上角的苹果图标</li>
                                <li>选择“关于本机”</li>
                                <li>在弹出的窗口中，查看“芯片或处理器”信息, 如果是Intel开头，就是 Intel 处理器，反之就是 Apple Silicon 处理器</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-center flex flex-col gap-2">
                        <CardTitle className="text-xl">MAC 安装包需要执行以下命令：</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 bg-slate-100 p-2 pl-3 rounded-md">
                            <code className="text-sm w-full">sudo xattr -rd com.apple.quarantine /path/to/QingZhou.dmg</code>
                            <CopyButton text="sudo xattr -rd com.apple.quarantine /path/to/QingZhou.dmg" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}