import React from "react";
import LimitSwitch, { LimitSwitchData } from "@/components/LimitSwitch";
import { Button } from "@/components/ui/button";

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

const globalLimitItems: LimitSwitchData<string>[] = [
  {
    uint: "小时",
    title: "使用时长限制",
    switchKey: "is_time_limited",
    dateKey: "time_period",
    valueKey: "time_limit",
  },
  {
    uint: "GB",
    title: "使用时长限制",
    switchKey: "is_traffic_limited",
    dateKey: "traffic_period",
    valueKey: "traffic_limit",
  },
];
const NodeGroupBox = ({ row,index,onChange}:any) => {
  return (
    <div className="border border-[#F0F0F0] rounded-lg">
      <div className="flex justify-between items-center px-5 py-[15px] border-b border-[#f0f0f0]">
        <div>{ row.name}</div>
        <AlertDialog >
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-15 h-8 rounded-md">
              移除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="lg:w-[412px]">
            <AlertDialogHeader>
              <AlertDialogTitle>确定移除节点组：{ row.name} ？</AlertDialogTitle>
              <AlertDialogDescription>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-15 h-8">取消</AlertDialogCancel>
              <AlertDialogAction className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-15 h-8">移除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="p-5">
        {globalLimitItems.map((item: LimitSwitchData<string>) => (
          <div className="last:mt-4" key={item.switchKey}>
            <LimitSwitch<string> item={item} data={row} onChange={(key:string,value:any)=> onChange(index,key,value)}  />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeGroupBox;
