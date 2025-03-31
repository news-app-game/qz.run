import React from 'react'
import { Button } from '@/components/ui/button'
import AdaptTable, { TableColumns } from '@/components/AdaptTable'
import Link from 'next/link'
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
    title: "节点名",
  },
  { key: "email", title: "区域" },
  { key: "role", title: "节点类型" },
  { key: "a", title: "套了CF" },
  {
    key: "b", title: "状态",
    headCell: () => (
      <div className='w-full flex justify-between items-center'>
        <span>状态</span>
        <img src="/FilterFilled.svg" alt="" />
      </div>
    ),
    width:85
  },
  { key: "c", title: "流量倍率" },
  { key: "d", title: "添加时间" },
];
const NodeGroupTableBox = () => {
  return (
    <div className="border border-[#F0F0F0] rounded-lg">
      <div className="flex justify-between items-center px-5 py-[15px] border-b border-[#f0f0f0]">
        <div>普通</div>
            <Button variant="outline" className="w-15 h-8 rounded-md">
            <Link href={`/admin/generateNodeGroup?id=${1}`}  > 编辑</Link>
            </Button>
      </div>
      <div className="p-5">
           <AdaptTable<User>  data={data} columns={columns} />
      </div>
    </div>
  )
}

export default NodeGroupTableBox