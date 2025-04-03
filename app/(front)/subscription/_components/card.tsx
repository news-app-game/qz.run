'use client'

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "./table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { getOrderList } from "@/api/order";
import dayjs from "dayjs";
export default function SubscriptionCard({ className }: { className?: string }) {
  const router = useRouter()
  const columns = [
    {
      header: "账单日期",
      accessorKey: "date",
      cell: ({ row }: { row: any }) => {
        return <span className="text-[#020618]">{dayjs(row.original.created_at).format('YYYY-MM-DD')}</span>
      }
    },
    {
      header: "金额",
      accessorKey: "price",
      cell: ({ row }: { row: any }) => {
        return <span className="text-[#020618]">{row.original.price}￡</span>
      }
    },
    {
      header: "状态",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => {
        const status = row.original.status;
        const commonClass: string = "rounded-[4px] border-1 shadow-none";
        let variant: string = "";
        // 1 已支付 2 待支付 3 已取消
        if (status === "已支付") {
          variant = "text-[#00CB00] bg-[#F1FFE9] border-[#92EF74] hover:bg-[#F1FFE9]";
        } else {
          variant = "text-[#F5222D] bg-[#FFEFF0] border-[#FF9898] hover:bg-[#FFEFF0]";
        }
        const statusText = status;

        return <Badge className={cn(commonClass, variant)}>{statusText}</Badge>
      }
    },
    {
      header: '套餐',
      accessorKey: 'package',
      cell: ({ row }: { row: any }) => {
        return <span className="text-[#020618]">{row.original.package_name}</span>
      }
    },
    {
      header: '购买时长',
      accessorKey: 'duration',
      cell: ({ row }: { row: any }) => {
        return <span className="text-[#020618]">{row.original.payment_month}个月</span>
      }
    },
  ]

  const [info, setInfo] = useState<any>(null)
  const [data, setData] = useState<any[]>([])
  const [pageSize, setPageSize] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    getList()
  }, [])
  const getList = async (page: number = currentPage) => {
    try {
      setLoading(true)
      const res = await getOrderList(page)
      const { data, meta } = res.data.orders
      const user_package = res.data.user_package
      setInfo(user_package)
      setPageSize(meta.per_page)
      setData(data)
      setTotal(meta.total)
      setCurrentPage(meta.current_page)
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }

  }
  // 渲染日期单位
  const renderDateUnit = (date: 'quarterly' | 'monthly' | 'annually') => {
    const map = {
      quarterly: '季',
      monthly: '月',
      annually: '年',
    }
    return map[date]
  }
  return <Card className={cn(className)}>
    <CardHeader className="flex flex-row items-center justify-center">
      <CardTitle className="text-2xl font-bold">套餐和账单</CardTitle>
    </CardHeader>
    <CardContent>
      {/* 套餐 */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col text-[#020618] gap-4">
          <p className="font-[500]">套餐</p>
          {
            info && (
              <>
                <div className="flex items-center justify-start gap-2.5">
                  <div className="font-[400]">当前套餐：{info.name}，<span className="font-[600]">{info.price}￡</span>/{renderDateUnit(info.current_period)}</div>
                </div>
                <div className="flex items-center justify-start gap-2.5">
                  <div className="font-[400]">您的套餐将于:  <span className="font-[600]">{dayjs(info.ended_at).format('YYYY-MM-DD')}</span>/失效</div>
                  <Button size="sm" variant="outline" onClick={() => {
                    const package_id = info.package_id
                    const period = info.current_period
                    router.push(`/payment?id=${package_id}&period=${period}`)
                  }}>续订</Button>
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* 账单 */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex flex-col text-[#020618] gap-4">
          <p className="font-[500]">账单</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between ">
              <DataTable
                loading={loading}
                columns={columns}
                data={data}
                pageSize={pageSize}
                currentPage={currentPage}
                total={total}
                onPageChange={(page) => {
                  console.log('page', page)
                  getList(page)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
}