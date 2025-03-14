'use client'

import { Copy } from "@phosphor-icons/react";
import { toast } from "sonner"

export function CopyButton({ text }: { text: string }) {

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success("复制成功");
    };

    return (
        <div className="flex items-center justify-center p-1 rounded hover:bg-slate-200 hover:cursor-pointer" onClick={handleCopy}>
            <Copy size={18} />
        </div>
    )
}