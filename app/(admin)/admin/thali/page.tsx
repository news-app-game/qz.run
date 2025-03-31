'use client';
import React, { useState} from 'react'
import ThaliBox, { Content, ThaliBoxProps } from "@/components/ThaliBox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
type ThaliBoxContent = {
  title: string,
  content: Content[]
}
type FormBody = {
  key1: string,
  key2: string,
  key3: string,
}
const free = {
  title: "免费套餐",
  content: [
    { label: "描述：", key: "key1" },
    { label: "月价格（￡）：", key: "key2" },
    { label: "全局线路限制：", key: "key3" },
    { label: "包含节点组：", key: "key4",infoKey:"info1" },
    { label: "同时在线设备数量（台）：", key: "key5" },
  ],
}
const ordinary = {
  title: "普通套餐",
  content: [
    { label: "描述：", key: "key1" },
    { label: "月价格（￡）：", key: "key2" },
    { label: "包含节点组：", key: "key4",infoKey:"info1" },
    { label: "同时在线设备数量（台）：", key: "key5" },
    {label: "同时在线设备数量（台）：", key: "key3"}
  ],
}
const senior = {
  title: "普通套餐",
  content: [
    { label: "描述：", key: "key1" },
    { label: "月价格（￡）：", key: "key2" },
    { label: "包含节点组：", key: "key4",infoKey:"info1" },
    { label: "同时在线设备数量（台）：", key: "key5" },
    {label: "同时在线设备数量（台）：", key: "key3"}
  ],
}
const thailBoxContent:ThaliBoxContent[] = [
  free,
  ordinary,
  senior,
]
const discountFormItems:Content[] = [
  { label: "季付", key: "key1" },
  { label: "半年付", key: "key2" },
  { label: "年付", key: "key3" },
]
const Thali = () => {
  const [formBody, setFormBody] = useState<FormBody>()
  
  const onChangeInputValue = (event: React.ChangeEvent<HTMLInputElement>, key: keyof FormBody) => { 
    setFormBody((prev) => ({ ...prev, [key]: event.target.value }))
  }
  return (
    <div className=' text-[rgba(0,0,0,0.88)]'>
      <div className=' text-base font-bold'>套餐节点</div>
      <div className='mt-[10px] flex flex-wrap gap-4'>
        {thailBoxContent.map((item, index) => (
          <ThaliBox key={index} title={ item.title} content={item.content} />
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
          <Button className="w-15 h-8 rounded-md">保存</Button>
          <Button variant="outline" className="w-15 h-8 rounded-md">取消</Button>
          </div>
          
        </div>
    </div>
  )
}

export default Thali