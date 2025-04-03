"use client";
import React, { useEffect, useState } from "react";
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
import { getNodeGroupsList } from "@/api/admin/nodes";
type AddNodeGroupDrawerProps = {
  children: React.ReactNode;
  push:(value:any)=>void
};


const AddNodeGroupDrawer = ({ children,push }: AddNodeGroupDrawerProps) => {

  const [data, setData] = useState<any[]>([])
  const columns: TableColumns<any>[] = [
    {
      key: "name",
      header: "节点组名",
      headCell: () => (
        <div className="w-full  flex items-center justify-between ">
          <div>节点组名</div>
          <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
        </div>
      )
    },
    {
      key: "action",
      header: "操作",
      className:"w-[77px]",
      headCell: () => <div className="w-[77px]">操作 </div>,
      cell: (row: any) => (
        <div className=" py-1 text-[#007AFF]" onClick={() => push({...row,is_time_limited:false,is_traffic_limited:false,time_limit:"",time_period:"0",traffic_limit:"",traffic_period:"0"}) }>添加 </div>
      ),
    }
  ]
  const getData = async () => {
    try { 
      const res = await getNodeGroupsList() as any
      if (res.code === 200) {
        setData(res.data)
      }
    } catch (err) {
      console.log(err);
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
        </DrawerHeader>
        <div className="p-6">
          <XwyaTable<any> data={data} total={0} columns={columns} />
        </div>
        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNodeGroupDrawer;
