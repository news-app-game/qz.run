"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import XwyaTable, { TableColumns } from "@/components/XwyaTable";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/tools/day";
import Image from "next/image";
interface NodeLocation {
  id: number;
  name: string;
  flag: string;
  status: number;
  created_at: string;
}
interface Node {
  id: number;
  name: string;
  average_downstream_traffic: string;
  average_upstream_traffic: string;
  connect_type: number;
  added_at: string;
  node_loc: NodeLocation;
  online_users_count: number;
  remark: string | null;
  status: boolean;
  total_traffic_count: string;
  url: string;
  traffic_ratio: string;
}
const columns: TableColumns<Node>[] = [
  {
    key: "name",
    header: "节点名",
    className: "min-w-[76px]",
  },
  { key: "node_loc.name", header: "区域", className: "min-w-[58px]" },
  { key: "remark", header: "节点类型", className: "min-w-[75px]" },
  {
    key: "connect_type",
    header: "套了CF",
    cell: (row: Node) => <div>{row.connect_type === 1 ? "是" : "否"}</div>,
  },
  {
    key: "status",
    header: "状态",
    headCell: () => (
      <div className="w-full flex justify-between items-center">
        <span>状态</span>
        <Image
          className="w-auto h-auto"
          width={24}
          height={24}
          src="/FilterFilled.svg"
          alt=""
        />
      </div>
    ),
    cell: (row: Node) => (
      <div
        className={cn(
          "w-10 h-[22px]  border  rounded-sm text-xs  flex justify-center items-center",
          row.status
            ? " border-[#B7EB8F] text-[#52C41A] bg-[##F6FFED]"
            : "bg-[#FFF1F0] border-[#FFA39E] text-[#F5222D]"
        )}
      >
        {row.status ? "启用" : "停用"}
      </div>
    ),
  },
  {
    key: "added_at",
    className: "min-w-[87px]",
    header: "添加时间",
    cell: (row: Node) => <div>{formatDate(row.added_at)}</div>,
  },
];
interface NodeGroupTableBoxProps<T> {
  row: T ;
}
const NodeGroupTableBox = <T extends { id: string | number; name: string;nodes:any[] },>(props: NodeGroupTableBoxProps<T>) => {
  
  return (
    <div className="border border-[#F0F0F0] rounded-lg">
      <div className="flex justify-between items-center px-5 py-[15px] border-b border-[#f0f0f0]">
        <div>{props.row.name}</div>
        <Button variant="outline" className="w-15 h-8 rounded-md">
          <Link href={`/admin/generateNodeGroup/${props.row.id}`}> 编辑</Link>
        </Button>
      </div>
      <div className="p-5">
        <XwyaTable data={props.row.nodes} total={0} columns={columns} />
      </div>
    </div>
  );
};

export default NodeGroupTableBox;
