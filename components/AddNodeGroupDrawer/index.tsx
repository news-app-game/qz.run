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
import AdaptTable, { TableColumns} from "@/components/AdaptTable";
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
    title: "节点组名",
    headCell: () => (
      <div className="w-full  flex items-center justify-between ">
        <div>节点组名</div>
        <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
      </div>
    )
  },
  {
    key: "action",
    title: "操作",
    headCell: () => <div className="w-[77px]">操作 </div>,
    cell: (row: any) => (
      <div className=" py-1 text-[#007AFF]">添加 </div>
    ),
    width:77
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
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <div className="p-6">
          {/* <div>
            <div className="flex text-[rgba(0,0,0,0.88)] text-sm font-bold items-center p-2 bg-[rgba(0,0,0,0.02)] border-b border-[#F0F0F0]">
              <div className="grow flex justify-between items-center pr-2 border-r-[0.5px] border-[#F0F0F0]">
                <span>节点组名</span>
                 <Search width={12} height={12} className="text-[rgba(0,0,0,0.25)]" />
              </div>
              <div className="w-[77px] shrink-0 pl-2">操作 </div>
            </div>
          </div>
          <div className="flex text-[rgba(0,0,0,0.88)] text-sm  items-center px-2 py-3  border-b border-[#F0F0F0]">
            <div className="grow  border-r-[0.5px] border-[#F0F0F0]">
               普通
            </div>
            <div className="w-[77px] shrink-0  text-[#007AFF]">
              <span className="cursor-pointer">添加</span>
            </div>
          </div> */}
          <AdaptTable<any> data={data} columns={columns} />
           
        </div>
        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNodeGroupDrawer;
