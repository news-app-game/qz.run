"use client";
import React, { useState,useMemo,useEffect } from 'react'
import XwyaTable, { TableColumns} from "@/components/XwyaTable"
import usePage, { PageType} from '@/hooks/use-page';
import { Search } from "lucide-react";
import Link from 'next/link';
import { getNodesList,deleteNode } from '@/api/admin/nodes';
import { cn } from '@/lib/utils';
import { formatDate } from '@/tools/day';
import bus from '@/tools/eventBus';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface NodeLocation {
  id: number;
  name: string;
  flag: string;
  status: number;
  created_at: string;
}

interface Node  {
  id: number;
  name: string;
  average_downstream_traffic: string;
  average_upstream_traffic: string;
  connect_type: number;
  created_at: string;
  node_loc: NodeLocation;
  online_users_count: number;
  remark: string | null;
  status: boolean;
  total_traffic_count: string;
  url: string;
}
interface NodeListApi {
  code: number,
  data: {
    meta: {
      total: number,
      current_page: number,
      per_page: number,
      last_page: number,
    },
    nodes: Node[]
  }
}

const Nodes = () => {
  const router = useRouter()
  const { data, page, total, setTotal, loading, setLoading, setData, setPage } = usePage<Node>()
  const [open, setOpen] = useState<boolean>(false)
  const [deleteNodeRow, setDeleteNodeRow] = useState<Node | null>(null)
  const columns:TableColumns<Node>[] =[
    {
      key: "name",
      header: "节点名",
      headCell: () => (
        <div className="w-full  flex items-center justify-between ">
          <div>节点名</div>
          <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
        </div>
      )
    },
    {
      key: "node_loc.name",
      header: "区域",
      headCell: () => (
        <div className='w-full flex justify-between items-center'>
          <span>区域</span>
          <img src="/FilterFilled.svg" alt="" />
        </div>
      ),
    },
    {
      key: "remark",  header: "节点类型",
      headCell: () => (
        <div className='w-full flex justify-between items-center'>
          <span>节点类型</span>
          <img src="/FilterFilled.svg" alt="" />
        </div>
      ),
   
     },
  {
    key: "connect_type",
    header: "套了CF",
    cell: (row: Node) => (<div>{ row.connect_type===1?"是":"否" }</div>)
     },
    {
      key: "status",  header: "状态",
      headCell: () => (
        <div className='w-full flex justify-between items-center'>
          <span>状态</span>
          <img src="/FilterFilled.svg" alt="" />
        </div>
      ),
      cell: (row:Node) => (
        <div className={cn("w-10 h-[22px]  border  rounded-sm text-xs  flex justify-center items-center",row.status?" border-[#B7EB8F] text-[#52C41A] bg-[##F6FFED]":"bg-[#FFF1F0] border-[#FFA39E] text-[#F5222D]") }>{row.status?"启用":"停用" }</div>
      )
    },
    {
      key: "url",  header: "地址",
        headCell: () => (
            <div className="w-full  flex items-center justify-between ">
              <div>地址</div>
              <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
            </div>
          )
    },
      {
        key: "total_traffic_count", header: "总流量数",
        headCell: () => (
          <div className='w-full flex justify-between items-center'>
            <span>总流量数</span>
            <img src="/Sort.svg" alt="" />
          </div>
        ),
    },
  
  
    { key: "average_upstream_traffic", header: "上行流量(30min)" },
    { key: "created_at", header: "创建时间", cell: (row: Node) => (<span>{ formatDate(row.created_at)}</span> )   },
    {
      key: "id",
      header: "操作",
      cell: (row: Node) => ( 
        <div className='flex gap-2'>
          <div className="cursor-pointer text-[#007AFF]" onClick={() => toModalPage(row)} >编辑</div>
          <div className="cursor-pointer text-red-700" onClick={()=> onDeleteTips(row)} >删除</div>
        </div>
        
     ) 
    },
  ]
  const toModalPage = (row: Node)=>{ 
    sessionStorage.setItem(`node-${row.id}`, JSON.stringify(row))
    router.push(`/admin/nodes/modal/${row.id}`)
  }
  const onDeleteTips =  (row:Node) => { 
    setOpen(true)
    setDeleteNodeRow(row)
  }
  const onDeleteNode = async () => { 
    try {
      if (!deleteNodeRow) { 
        toast.error("删除失败")
        return
      }
      const res = await deleteNode<Omit<NodeListApi,"data">>(deleteNodeRow.id)
      if (res.code === 200) { 
        getData()
        toast.success("删除成功")
        setOpen(false)
        setDeleteNodeRow(null)
      }
    } catch (err: any) { 
      toast.error(`删除失败:${JSON.stringify(err)}`)
      console.error(err)
    }
  }
  const getData = async (newPage?: PageType) => { 
    try {
      setLoading(true)
      const res = await getNodesList<NodeListApi>({ ...page, ...newPage })
      if (res.code === 200) {
        setData(res.data.nodes)
        setTotal(res.data.meta.total)
        setPage({
          ...page,
          ...newPage,
          last_page: res.data.meta.last_page,
        })
      }
    } catch (e: any) {
      console.error(e);
    } finally { 
      setLoading(false)
    }
  }
  const onChange = (current_page: number) => {
    const newPage = { ...page, page:current_page }
    setPage(newPage)
    getData(newPage)
  }
  useEffect(() => { 
    getData()
    bus.on("updateNodes", () => {
      getData()
    })
    return () => {
      bus.off("updateNodes")
    }
  },[])
  return (
    <div>
      <XwyaTable<Node> data={data} columns={columns} loading={loading} total={total} page={page} onChange={onChange} />
      <AlertDialog open={ open} onOpenChange={setOpen}  >
      <AlertDialogTrigger asChild>
      </AlertDialogTrigger>
      <AlertDialogContent className="lg:w-[412px]">
        <AlertDialogHeader>
            <AlertDialogTitle>确定删除节点：{deleteNodeRow && deleteNodeRow.name} ？</AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-15 h-8">取消</AlertDialogCancel>
          <AlertDialogAction className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-15 h-8" onClick={onDeleteNode} >移除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default Nodes