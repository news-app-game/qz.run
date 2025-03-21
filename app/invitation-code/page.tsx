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
import axios from "axios";

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
  ];

  return codes;
}

export default function InvitationCode() {
  const [inviteCodes, setInviteCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(0);

  const [error, setError] = useState("");
  const fetchInviteCodes = () => {
    setIsLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/invite-code`)
      .then((result) => {
        setInviteCodes(result.data.data.inviteCodes);
        setDailyLimit(result.data.data.dailyLimit);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "获取邀请码失败");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
              <InvitationCodeList codes={inviteCodes||[]} />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
