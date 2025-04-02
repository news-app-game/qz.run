'use client';
import React, { useEffect, useState} from 'react'
import ThaliBox, { Content } from "@/components/ThaliBox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getThaliList,setDiscount } from '@/api/admin/thali';
import { toast } from 'sonner';
class FormBody  {
  annually_discount: string=""
  quarterly_discount: string=""
  semi_annually_discount: string=""
}
type DiscountItem = {
  label: string,
  key: keyof FormBody,
}

type ThaliBoxContent = {
  id:string |number
  title: string,
  content: Content[]
}
const discountFormItems:DiscountItem[] = [
  { label: "季付", key: "quarterly_discount" },
  { label: "半年付", key: "semi_annually_discount" },
  { label: "年付", key: "annually_discount" },
]
let period = ["天", "周", "月"]
const Thali = () => {
  const [formBody, setFormBody] = useState<FormBody>(new FormBody())
  const [thaliList, setThaliList] = useState<ThaliBoxContent[]>([])
  const getData = async () => { 
    try { 
    const res = await getThaliList() as any
    if (res.code === 200) { 
      let data =  res.data.packages.reduce((prev:any, item:any) => {
        let globalFlag = !!item.is_time_limited || !!item.is_traffic_limited
        let globalTips = []
        if (!!item.is_time_limited) {
          globalTips.push(`每${period[item.time_period]} ${item.time_limit} 小时`)
        }
        if (!!item.is_traffic_limited) {
          globalTips.push(`每${period[item.traffic_period]} ${item.traffic_limit}GB 流量`)
        }
        let resultGlobalLimited = globalTips.join("，")
        
        let node_groups = []
        let limited=  item.package_node_groups.reduce((arv:any, itemb:any) => { 
          let nameAndTips = [itemb.node_group?.name]
          let tips = []
          if (!!itemb.is_time_limited) { 
             tips.push(`每${period[itemb.time_period]} ${itemb.time_limit} 小时`) 
          }
          if (!!itemb.is_traffic_limited) {
            tips.push(`每${period[itemb.traffic_period]} ${itemb.traffic_limit}GB 流量`)
          }
          let tipsText = tips.join("，")
          tipsText && nameAndTips.push(tipsText)
          let result = nameAndTips.join("\n")
          arv.push(result)
          return arv
        }, [])
        let resultLimited = limited.join("\n")
        prev.push({
          id:item.id,
          title: item.name,
          content: [
            { label: "描述：", key: "description", value: item.description },
            { label: "全局线路限制：", key: "key3",value:resultGlobalLimited, flag:!globalFlag },
            { label: "月价格（￡）：", key: "monthly_price",value: item.monthly_price },
            { label: "包含节点组：", key: "key4",infoKey:"info1",value:resultLimited },
            { label: "同时在线设备数量（台）：", key: "max_online_devices",value: item.max_online_devices},
            {label: "其他权益：", key: "other_benefits",value: item.other_benefits.join(","),flag:!item.user_subscribed}
          ],
        })

        return prev
      }, [])
      
       setThaliList(data)
      setFormBody(res.data.site_config)
      
    }} catch (err) {
      console.error(err)
    }
  }
  const sendFormBody = async () => { 
    try { 
      const res = await setDiscount(formBody) as any
      if (res.code === 200) { 
        toast.success("保存成功")
      }
    } catch (err) { 
      toast.error(`err:${JSON.stringify(err)}`)
     console.error(err)
    }
  }
  const onChangeInputValue = (event: React.ChangeEvent<HTMLInputElement>, key: keyof FormBody) => { 
    setFormBody((prev) => ({ ...prev, [key]: event.target.value }))
  }
  useEffect(() => { 
    getData()
  },[])
  return (
    <div className=' text-[rgba(0,0,0,0.88)]'>
      <div className=' text-base font-bold'>套餐节点</div>
      <div className='mt-[10px] flex flex-wrap gap-4'>
        {thaliList.map((item, index) => (
          <ThaliBox key={index} title={item.title} id={item.id} content={item.content as Content[]} />
        ))}
  
      </div>
      <div className=' text-base font-bold mt-6'>折扣设置（对所有套餐生效）</div>
        <div className='flex mt-[10px] gap-x-4 gap-y-[10px] flex-wrap'>
          {discountFormItems.map((item) => (
            <div className='w-[376.67px]' key={item.key} >
              <Label htmlFor={item.key}>{item.label}</Label>
              <Input className='mt-1' id={item.key} type="text" value={formBody?.[item.key]} onChange={(event) => onChangeInputValue(event,item.key)} />
             </div>
          ))}
          <div className='w-full flex gap-2'>
          <Button className="w-15 h-8 rounded-md !bg-[#1677FF]" onClick={ sendFormBody}>保存</Button>
          <Button variant="outline" className="w-15 h-8 rounded-md"  onClick={() => window.location.reload()} >取消</Button>
          </div>
          
        </div>
    </div>
  )
}

export default Thali