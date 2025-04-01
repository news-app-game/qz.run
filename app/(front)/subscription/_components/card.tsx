'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "./table";
import { Badge } from "@/components/ui/badge";
export default function SubscriptionCard({ className }: { className?: string }) {
  const columns = [
    {
      header: "账单日期",
      accessorKey: "date",
    },
    {
      header: "金额",
      accessorKey: "amount",
    },
    {
      header: "状态",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        let variant: string = "";
        // 1 已支付 2 待支付 3 已取消
        if (status === "1") {
          variant = "text-[#00CB00] bg-[#F1FFE9] border-1 border-[#92EF74] shadow-none hover:bg-[#F1FFE9]";
        } else if (status === "2") {
          variant = "text-[#FF9800] bg-[#FFF4E6] border-1 border-[#FF9800] shadow-none hover:bg-[#FFF4E6]";
        } else if (status === "3") {
          variant = "text-[#FF0000] bg-[#FFE6E6] border-1 border-[#FF0000] shadow-none hover:bg-[#FFE6E6]";
        }
        const statusText = status === "1" ? "已支付" : status === "2" ? "待支付" : "已取消";

        return <Badge className={cn(variant)}>{statusText}</Badge>
      }
    },
    {
      header: '套餐',
      accessorKey: 'package',
    },
    {
      header: '购买时长',
      accessorKey: 'duration',
    },
  ]
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const data = await new Promise(resolve => {
        setTimeout(() => {
          const data = [
            {
              date: "2025-03-01",
              amount: "7.92￡",
              status: "1",
              package: "普通套餐",
              duration: "1个月",
            },
            {
              date: "2025-03-01",
              amount: "7.92￡",
              status: "2",
              package: "普通套餐",
              duration: "1个月",
            },
            {
              date: "2025-03-01",
              amount: "7.92￡",
              status: "3",
              package: "普通套餐",
              duration: "1个月",
            },
          ]
          resolve(data)
        }, 1000)
      })
      console.log('data', data)
      setData(data as any[])
    }
    fetchData()
  }, [])
  return <Card className={cn(className)}>
    <CardHeader className="flex flex-row items-center justify-center">
      <CardTitle className="text-2xl font-bold">套餐和账单</CardTitle>
    </CardHeader>
    <CardContent>
      {/* 套餐 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col text-[#020618] gap-4">
          <p className="font-[500]">套餐</p>
          <div className="flex items-center justify-start gap-2.5">
            <div className="font-[400]">当前套餐：普通套餐，<span className="font-[600]">7.92￡</span>/季</div>
            <Button size="sm">更改套餐</Button>
          </div>
          <div className="flex items-center justify-start gap-2.5">
            <div className="font-[400]">您的套餐将于:  <span className="font-[600]">2025-03-01</span>/失效</div>
            <Button size="sm" variant="outline">续订</Button>
          </div>
        </div>
      </div>

      {/* 账单 */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex flex-col text-[#020618] gap-4">
          <p className="font-[500]">账单</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between ">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
}