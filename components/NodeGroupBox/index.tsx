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
type TestBody = {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  ingredients: string[];
  quantity: number;
  unit: string;
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
const globalLimitItems: LimitSwitchData<keyof TestBody>[] = [
  {
    uint: "小时",
    title: "时长限制",
    switchKey: "quantity",
    dateKey: "createdAt",
    valueKey: "quantity",
  },
  {
    uint: "GB",
    title: "流量限制",
    switchKey: "status",
    dateKey: "createdAt",
    valueKey: "quantity",
  },
];
const NodeGroupBox = () => {
  return (
    <div className="border border-[#F0F0F0] rounded-lg">
      <div className="flex justify-between items-center px-5 py-[15px] border-b border-[#f0f0f0]">
        <div>普通</div>
        <AlertDialog >
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-15 h-8 rounded-md">
              移除
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="lg:w-[412px]">
            <AlertDialogHeader>
              <AlertDialogTitle>确定移除节点组：CN2 ？</AlertDialogTitle>
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
        {globalLimitItems.map((item: LimitSwitchData<keyof TestBody>) => (
          <div className="last:mt-4" key={item.switchKey}>
            <LimitSwitch<keyof TestBody> item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeGroupBox;
