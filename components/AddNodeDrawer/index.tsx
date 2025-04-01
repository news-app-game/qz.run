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
import XwyaTable, {TableColumns} from "@/components/XwyaTable";
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  a: string;
  b: string;
  c: string;
  d: string;
}
const data:User[] = [
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "管理员",a:"1",b:"2",c:"3",d:"4" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "用户",a:"1",b:"2",c:"3",d:"4" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "用户" ,a:"1",b:"2",c:"3",d:"4"},
];
const columns:TableColumns<User>[] = [
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
    key: "email", 
    headCell: () => (
      <div className='w-full flex justify-between items-center'>
        <span>区域</span>
        <img src="/FilterFilled.svg" alt="" />
      </div>
    ),
  },
  {
    key: "role", 
    headCell: () => (
      <div className='w-full flex justify-between items-center'>
        <span>节点类型</span>
        <img src="/FilterFilled.svg" alt="" />
      </div>
    ),
   },
  { key: "a", header: "套了CF" },
  {
    key: "b", header: "状态",
    headCell: () => (
      <div className='w-full flex justify-between items-center'>
        <span>状态</span>
        <img src="/FilterFilled.svg" alt="" />
      </div>
    ),
  },

  {
    key: "d", 
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
    cell:()=>( 
      <div className=" text-[#007AFF]">添加</div>
   ) 
  },
];
const AddNodeDrawer = ({ children}: {children:React.ReactNode}) => {
  return (
    <Drawer   direction="right" >
    <DrawerTrigger asChild>{children}</DrawerTrigger>
    <DrawerContent className="!max-w-none w-1/2" >
      <DrawerHeader className="border-b border-[#F0F0F0]">
        <DrawerTitle> <div className="flex gap-4 items-center "><DrawerClose><X width={20} height={20} className=" text-[rgba(0,0,0,0.45)]"/></DrawerClose>  添加节点组</div> </DrawerTitle>
        {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
      </DrawerHeader>
      <div className="p-6">
        <XwyaTable<any> data={data} columns={columns} />
      </div>
      <DrawerFooter>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
  )
}

export default AddNodeDrawer