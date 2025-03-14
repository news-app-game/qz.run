import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t text-sm text-muted-foreground">
            <div className="flex flex-col-reverse gap-3 sm:flex-row items-center max-w-[1024px] mx-auto p-6">
                <div>
                    © 2025 轻舟. 保留所有权利.
                </div>
                <nav className="flex-1 flex justify-end gap-x-6 gap-y-2 flex-wrap">
                    <Link href="/help-center" className="hover:underline">帮助中心</Link>
                    <Link href="/privacy" className="hover:underline">隐私政策</Link>
                    <Link href="/terms-of-service" className="hover:underline">服务条款</Link>
                    <Link href="/feedback" className="hover:underline">问题反馈</Link>
                    <Link href="https://t.me/tmp_user_ok" className="hover:underline">联系我们</Link>
                </nav>
            </div>
        </footer>
    )
}