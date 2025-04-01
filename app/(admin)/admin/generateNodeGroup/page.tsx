import React from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import XwyaTable, { TableColumns} from '@/components/XwyaTable'
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
import AddNodeDrawer from '@/components/AddNodeDrawer';
interface GenerateNodeGroupProps {
  searchParams: Promise<{
    id?: string;
  }>;
}
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
    header: "节点名",
  },
  { key: "email", header: "区域" },
  { key: "role", header: "节点类型" },
  { key: "a", header: "套了CF" },
  {
    key: "b", header: "状态",
    headCell:(
      <div className='w-full flex justify-between items-center'>
        <span>状态</span>
        <img src="/FilterFilled.svg" alt="" />
      </div>
    ),
  },
  { key: "d", header: "添加时间" },
  { key: "c", header: "流量倍率" },
  {
    key: "id",
    header: "操作",
    cell:(<AlertDialog >
      <AlertDialogTrigger asChild>
      <div className=" text-[#007AFF]">移除</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="lg:w-[412px]">
        <AlertDialogHeader>
          <AlertDialogTitle>确定移除节点：美国1 ？</AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-15 h-8">取消</AlertDialogCancel>
          <AlertDialogAction className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-15 h-8">移除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>) 
  },
];
const GenerateNodeGroup = (props:GenerateNodeGroupProps) => {
  return (
    <div>
      <div>
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          基础信息
        </div>
        <div className="mt-[10px]">
            <div>
            <Label htmlFor="base_name">名称</Label>
              <Input
                id="base_name"
                type="text"
                placeholder="123"
                className="lg:w-[400px] h-8 mt-1"
              />
            </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          包含节点（4）
        </div>
        <AddNodeDrawer >
        <div className="flex items-center gap-2 my-[10px] w-[112px] h-8 rounded-md border-dotted border border-[#D9D9D9] cursor-pointer text-sm text-[rgba(0,0,0,0.88)] justify-center">
              <Plus width={16} height={16} />
              <span>添加节点</span>
            </div>
        </AddNodeDrawer>
      
        <div>
          <XwyaTable<User> data={data} columns={columns} />
          
        </div>
        </div>
    </div>
  )
}

export default GenerateNodeGroup