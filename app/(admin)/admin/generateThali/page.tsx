"use client";
import React, { useState, useMemo,useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LimitSwitch, { LimitSwitchData } from "@/components/LimitSwitch";
import { Plus } from "lucide-react";
import NodeGroupBox from "@/components/NodeGroupBox";
import AddNodeGroupDrawer from "@/components/AddNodeGroupDrawer";
import bus from "@/tools/eventBus";
import { useSearchParams } from "next/navigation";
import { getThaliInfo } from "@/api/admin/thali";
import {toast} from "sonner"

const baseItems: Record<string, any>[] = [
  { label: "名称", key: "name" },
  { label: "描述", key: "description" },
  { label: "月价格（￡）", key: "monthly_price" },
];
class Package {
  name: string = "";
  description: string = "";
  monthly_price: string = "";
  is_time_limited: boolean = false; // 是否有时间限制 (0: 否, 1: 是)
  is_traffic_limited: boolean = false; // 是否有流量限制 (0: 否, 1: 是)
  time_limit: string = ""; // 时间限制（单位可能是天/月）
  time_period: string = "0"; // 时间周期（如 1 代表按月, 2 代表按年）
  traffic_limit: string = ""; // 流量限制（单位可能是 MB/GB）
  traffic_period: string = "0"; // 流量周期（如 1 代表按天, 2 代表按月）
  max_online_devices: string = ""; // 最大同时在线设备数
  other_benefits: any[] = []; // 其他福利
  node_group_ids: any[] = []; // 关联的节点组 ID
}

let defaultValue = new Package();
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

const GenerateThali = () => {
  const searchParams = useSearchParams()
  const [formBody, setFormBody] = useState<Record<string, any>>(new Package());
  const hasChanged = useMemo(() => {
    console.log(formBody,defaultValue);
    
    return JSON.stringify(formBody) !== JSON.stringify(defaultValue);
  }, [formBody]);
  const onChangeValue = (key: string, value: any) => {
    console.log(key, value);

    setFormBody((prev) => ({ ...prev, [key]: value }));
  };
  const onChangeGroupValue = (index: number, key: string, value: any) => {
    setFormBody((prev) => {
      const newFormBody = { ...prev };
      newFormBody.node_group_ids[index][key] = value;
      return newFormBody;
    });
  };
  const onPushGroup = (value: any) => {
    if (formBody.node_group_ids.find((item: any) => item.id === value.id)) {
      toast.error("节点组已经添加");
      return;
    }
    setFormBody((prev) => {
      const newFormBody = { ...prev };
      newFormBody.node_group_ids.push(value);
      return newFormBody;
    });
  };
  const onRemoveGroup = (id: any) => {
    setFormBody((prev) => {
      const newFormBody = { ...prev };
      newFormBody.node_group_ids = newFormBody.node_group_ids.filter(
        (item: any) => item.id !== id
      );
      return newFormBody;
    });
  };
  const onChangeBenefitsValue = (index: number, key: string, value: any) => {
    setFormBody((prev) => {
      const newFormBody = { ...prev };
      newFormBody.other_benefits[index][key] = value;
      return newFormBody;
    });
  };
  const onPushBenefits = () => {
    setFormBody((prev) => {
      const newFormBody = { ...prev };
      newFormBody.other_benefits.push({ value: "" });
      return newFormBody;
    });
  };
  const getLoadDefautlValue = async () => { 
    try {
      const res = await getThaliInfo(searchParams.get("id")) as any 
      if (res.code === 200) { 
        
        res.data.node_group_ids = res.data.package_node_groups.map((item: any) => {
          return {
            ...item,
            is_time_limited: !!item.is_time_limited,
            is_traffic_limited: !!item.is_traffic_limited,
            time_period: item.time_period != null?"0" : item.time_period.toString(),
            traffic_period: item.traffic_period?"0":  item.traffic_period.toString(),
            traffic_limit: item.traffic_limit && item.traffic_limit.toString(),
            time_limit: item.time_limit && item.time_limit.toString(),
            name:item.node_group?.name
          }
        })
        res.data.other_benefits = res.data.other_benefits.map((item: string) => ({ value: item }))
        defaultValue = JSON.parse(JSON.stringify(res.data))
        setFormBody(res.data)
      }
    } catch (err) { 
      console.log(err);
      
    }
    
  } 
  useEffect(() => { 
      if ( searchParams.get("id")) { 
        getLoadDefautlValue()
      }
    },[])
  useEffect(() => {
    bus.emit("changeThaliValue", hasChanged);
  }, [hasChanged]);
  useEffect(() => {
    bus.emit("saveThali", formBody);
  }, [formBody]);
  return (
    <div>
      <div>
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          基础信息
        </div>
        <div className="mt-[10px]">
          {baseItems.map((item:any) => (
            <div key={item.key}>
              <Label htmlFor={item.key}>{item.label}</Label>
              <Input
                id={item.key}
                type="text"
                value={formBody[item.key]}
                onChange={(e) => onChangeValue(item.key, e.target.value)}
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
          {globalLimitItems.map((item:any) => (
            <div className="mt-[10px] last:mt-3" key={item.switchKey}>
              <LimitSwitch<string>
                item={item}
                data={formBody}
                onChange={onChangeValue}
              />
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
            {formBody.node_group_ids.map((item:any, index:number) => (
              <div
                className="w-[calc(50%-8px)] max-md:w-full"
                key={item.id || index}
              >
                <NodeGroupBox
                  onChange={onChangeGroupValue}
                  row={item}
                  index={index}
                />
              </div>
            ))}
          </div>
          <AddNodeGroupDrawer push={onPushGroup}>
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
            value={formBody.max_online_devices}
            onChange={(e) =>
              onChangeValue("max_online_devices", e.target.value)
            }
            placeholder="请输入同时限制设备数量"
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
            {formBody.other_benefits.map((item:any, index:number) => (
              <Input
                className="lg:w-[400px] h-8"
                key={index}
                value={item.value}
                onChange={(e) =>
                  onChangeBenefitsValue(index, "value", e.target.value)
                }
              />
            ))}

            {/* <Input className="lg:w-[400px] h-8 " /> */}
          </div>
          <div
            onClick={onPushBenefits}
            className="flex items-center gap-2  w-[112px] h-8 rounded-md border-dotted border border-[#D9D9D9] cursor-pointer text-sm text-[rgba(0,0,0,0.88)] justify-center"
          >
            <Plus width={16} height={16} />
            <span>添加条目</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateThali;
