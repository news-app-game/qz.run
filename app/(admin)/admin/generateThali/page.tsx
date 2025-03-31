import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LimitSwitch, { LimitSwitchData } from "@/components/LimitSwitch";
import { Plus } from "lucide-react";
import NodeGroupBox from "@/components/NodeGroupBox";
import AddNodeGroupDrawer from "@/components/AddNodeGroupDrawer";
interface GenerateThaliProps {
  searchParams: Promise<{
    id?: string;
  }>;
}
type FormBody = {
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
type BaseItem = {
  label: string;
  key: keyof FormBody;
};
const baseItems: BaseItem[] = [
  { label: "名称", key: "name" },
  { label: "描述", key: "description" },
  { label: "月价格（￡）", key: "price" },
];

const globalLimitItems: LimitSwitchData<keyof FormBody>[] = [
  {
    uint: "小时",
    title: "使用时长限制",
    switchKey: "quantity",
    dateKey: "createdAt",
    valueKey: "quantity",
  },
  {
    uint: "GB",
    title: "使用时长限制",
    switchKey: "status",
    dateKey: "createdAt",
    valueKey: "quantity",
  },
];
const GenerateThali = (props: GenerateThaliProps) => {
  return (
    <div>
      <div>
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          基础信息
        </div>
        <div className="mt-[10px]">
          {baseItems.map((item: BaseItem) => (
            <div key={item.key}>
              <Label htmlFor={item.key}>{item.label}</Label>
              <Input
                id={item.key}
                type="text"
                placeholder={item.label}
                className="lg:w-[400px] h-8 mt-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          全局限制（开启此项后，节点组内的限制将被忽略
        </div>
        <div>
          {globalLimitItems.map((item: LimitSwitchData<keyof FormBody>) => (
            <div className="mt-[10px] last:mt-3" key={item.switchKey}>
              <LimitSwitch<keyof FormBody> item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          包含节点组
        </div>
        <div>
          <div className="flex gap-4 my-[10px] flex-wrap">
            <div className="w-[calc(50%-8px)] max-md:w-full">
              <NodeGroupBox />
            </div>
            <div className="w-[calc(50%-8px)] max-md:w-full">
              <NodeGroupBox />
            </div>
          </div>
          <AddNodeGroupDrawer>
            <div className="flex items-center gap-2  w-[126px] h-8 rounded-md border-dotted border border-[#D9D9D9] cursor-pointer text-sm text-[rgba(0,0,0,0.88)] justify-center">
              <Plus width={16} height={16} />
              <span>添加节点组</span>
            </div>
          </AddNodeGroupDrawer>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          同时在线设备限制
        </div>
        <div className="mt-[10px]">
          <Label htmlFor="num">数量（台）</Label>
          <Input
            id="num"
            type="text"
            // placeholder={item.label}
            className="lg:w-[400px] h-8 mt-1"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          其他权益
        </div>
        <div>
          <div className="flex flex-col gap-[10px] my-[10px]">
            <Input className="lg:w-[400px] h-8 " />
            <Input className="lg:w-[400px] h-8 " />
          </div>
          <div className="flex items-center gap-2  w-[112px] h-8 rounded-md border-dotted border border-[#D9D9D9] cursor-pointer text-sm text-[rgba(0,0,0,0.88)] justify-center">
              <Plus width={16} height={16} />
              <span>添加条目</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateThali;
