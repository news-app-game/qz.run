import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InvitationCodeList } from "./_components";

async function getInvitationCodes() {
    const codes = [
        "67D1AF80AFB0A",
        "67D1AF80AFB1A",
        "67D1AF80AFB2A",
        "67D1AF80AFB3A",
        "67D1AF80AFB4A",
        "67D1AF80AFB5A",
        "67D1AF80AFB6A",
        "67D1AF80AFB7A",
        "67D1AF80AFB8A",
        "67D1AF80AFB9A",
        "67D1AF80AFBAA",
        "67D1AF80AFBBA",
        "67D1AF80AFBCA",
        "67D1AF80AFBDA",
        "67D1AF80AFBEA",
        "67D1AF80AFBFA",
        "67D1AF80AFBGA",
        "67D1AF80AFBHA",
        "67D1AF80AFBIA",
    ]

    return codes
}

export default async function InvitationCode() {
    const codes = await getInvitationCodes()
    const description =  codes.length > 0 ? "每日凌晨0点送出300个邀请码，请留意官网公告" : "今日邀请码已用完，明日0点后发放免费邀请码，敬请期待"
    
    return (
        <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-start gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader className="text-center flex flex-col gap-2">
                        <CardTitle className="text-2xl">邀请码</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    {codes.length > 0 && (
                        <CardContent>
                            <InvitationCodeList codes={codes} />
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    )
}