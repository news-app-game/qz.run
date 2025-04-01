"use client";
import React from "react";
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
import XwyaTable, { TableColumns} from "@/components/XwyaTable";
type AddNodeGroupDrawerProps = {
  // open: boolean
  children: React.ReactNode;
};
const data:any[] = [
  {name:"普通",id:1}
]
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
    headCell: () => <div className="w-[77px]">操作 </div>,
    cell: (row: any) => (
      <div className=" py-1 text-[#007AFF]">添加 </div>
    ),
  }

]
// open,
const AddNodeGroupDrawer = ({ children }: AddNodeGroupDrawerProps) => {
  // useEffect(() => {
  //   if (open) {
  //     // 执行打开逻辑
  //   } else {
  //     // 执行关闭逻辑
  //   }
  // }, [open])
  // open={open}
  return (
    <Drawer   direction="right" >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-none w-1/2" >
        <DrawerHeader className="border-b border-[#F0F0F0]">
          <DrawerTitle> <div className="flex gap-4 items-center "><DrawerClose><X width={20} height={20} className=" text-[rgba(0,0,0,0.45)]"/></DrawerClose>  添加节点组</div> </DrawerTitle>
        </DrawerHeader>
        <div className="p-6">

          <XwyaTable<any> data={data} columns={columns} />
           
        </div>
        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNodeGroupDrawer;
