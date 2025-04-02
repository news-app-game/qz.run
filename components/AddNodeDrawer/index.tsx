"use client";
import React, { useEffect,useState} from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X,Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import XwyaTable, { TableColumns } from "@/components/XwyaTable";
import { getNodesList } from "@/api/admin/nodes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatDate } from "@/tools/day";
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
  added_at: string;
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
interface ParamsNode { 
  id: string | number
  traffic_ratio: string
}
interface AddNodeDrawerProps<T> { 
  children: React.ReactNode
  onChange: (value:T)=>void
}



const AddNodeDrawer = <T,>({ children,onChange }: AddNodeDrawerProps<T>) => {
  const [data, setData] = useState<Node[]>([])
  const columns: TableColumns<Node>[] = [
    {
      key: "name",
      headCell: () => (
        <div className="w-full  flex items-center justify-between ">
          <div>节点名</div>
          <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
        </div>
      )
    },
    {
      key: "node_loc.name", 
      headCell: () => (
        <div className='w-full flex justify-between items-center'>
          <span>区域</span>
          <img src="/FilterFilled.svg" alt="" />
        </div>
      ),
    },
    {
      key: "remark", 
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
             <Image  className="w-auto h-auto" width={24} height={24} src="/FilterFilled.svg" alt="" />
           </div>
         ),
         cell: (row:Node) => (
           <div className={cn("w-10 h-[22px]  border  rounded-sm text-xs  flex justify-center items-center",row.status?" border-[#B7EB8F] text-[#52C41A] bg-[##F6FFED]":"bg-[#FFF1F0] border-[#FFA39E] text-[#F5222D]") }>{row.status?"启用":"停用" }</div>
         )
       },
  
    {
      key: "url", 
        headCell: () => (
            <div className="w-full  flex items-center justify-between ">
              <div>地址</div>
              <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
            </div>
          )
     },
    {
      key: "id",
      header: "操作",
      cell:(row:Node)=>( 
        <div className=" text-[#007AFF]" onClick={()=>onAdd(row)}>添加</div>
     ) 
    },
  ];
  const onAdd = (row: Node) => {
    onChange({...row,traffic_ratio:"",added_at:formatDate(new Date())} as T)
  }
const getData = async () => { 
  try {
    const res = await getNodesList<NodeListApi>({page:1,per_page:1000}) 
    if (res.code === 200) { 
      setData(res.data.nodes)
    }
   } catch (err) {
    console.error(err);
    
   }
  }
  useEffect(() => { 
    getData()
  },[])
  return (
    <Drawer   direction="right" >
    <DrawerTrigger asChild>{children}</DrawerTrigger>
    <DrawerContent className="!max-w-none w-1/2" >
      <DrawerHeader className="border-b border-[#F0F0F0]">
        <DrawerTitle> <div className="flex gap-4 items-center "><DrawerClose><X width={20} height={20} className=" text-[rgba(0,0,0,0.45)]"/></DrawerClose>  添加节点组</div> </DrawerTitle>
        {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
      </DrawerHeader>
      <div className="p-6">
        <XwyaTable<Node> data={data} columns={columns} />
      </div>
      <DrawerFooter>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  )
}

export default AddNodeDrawer