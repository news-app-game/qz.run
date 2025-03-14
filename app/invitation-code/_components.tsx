'use client'

import Link from "next/link";
import { toast } from "sonner"

function InvitationCodeList({ codes }: { codes: string[] }) {
    return (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {codes.map((code) => (
                <InvitationCodeItem key={code} code={code} />
            ))}
        </div>
    )
}

function InvitationCodeItem({ code }: { code: string }) {
    return (
        <Link href={`/signup?code=${code}`} onClick={() => toast.success("邀请码已复制")}>
            <div className="flex items-center justify-center border rounded-md p-2 hover:bg-slate-100 hover:cursor-pointer">{code}</div>
        </Link>
    )
}

export { InvitationCodeList, InvitationCodeItem }