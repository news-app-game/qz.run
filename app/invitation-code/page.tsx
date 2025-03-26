"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { InvitationCodeList } from "./_components";
import { useEffect, useState } from "react";
import { getInviteCode } from "@/api/inviteCode";

export default function InvitationCode() {
  const [inviteCodes, setInviteCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(0);

  const [error, setError] = useState("");
  const fetchInviteCodes = async () => {
    setIsLoading(true);
    const { code, data, message } = await getInviteCode()
    if (code === 200) {
      setInviteCodes(data.inviteCodes);
      setDailyLimit(data.dailyLimit);
    } else {
      setError(message || "获取邀请码失败");
    }
  };
  useEffect(() => {
    fetchInviteCodes();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-134px)] bg-slate-50 flex flex-col items-center justify-start gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader className="text-center flex flex-col gap-2">
            <CardTitle className="text-2xl">邀请码</CardTitle>
            <CardDescription>
              每日凌晨0点送出{dailyLimit}个邀请码，请留意官网公告
            </CardDescription>
          </CardHeader>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <CardContent>
              <InvitationCodeList codes={inviteCodes || []} />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
