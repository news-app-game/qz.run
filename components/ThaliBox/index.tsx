import React from 'react'
import { Button } from "@/components/ui/button" 
import Link from "next/link";
export type Content = {
  label: string
  key: string
  infoKey?: string
  flag: boolean
  value:string
}
export type ThaliBox = {
  id:string | number
  title: string
  content: Content[]
}

const ThaliBox = (props: ThaliBox) => {
  const { title, content,id}  = props
  return (
    <div className='w-[370.67px] rounded-lg border border-[#E5E7EB]'>
      <div className='px-5 py-3 border-b border-[#F0F0F0] flex justify-between items-center'>
        <div className='text-base font-bold'>{ title}</div>
        <Button variant="outline" className='w-15 h-8 rounded-md'> <Link href={`/admin/generateThali?id=${id}`}  > 编辑</Link> </Button>
      </div>
      <div className='p-5 flex flex-col gap-4 '>
        {content.map((item) => (
          <div key={item.key}>
          {
            !item.flag &&
            <div  >
            <div className="text-sm text-[rgba(0,0,0,0.45)]">{ item.label}</div>
            <div className='text-sm text-[rgba(0,0,0,0.88)] mt-1 whitespace-pre-line'>{item.value}</div>
            {/* {item?.infoKey && <div className='text-sm text-[rgba(0,0,0,0.88)] mt-1'>{ item.infoKey}</div>} */}
        </div>
          } </div>
          
        ))}
        
      </div>
    </div>
  )
}

export default ThaliBox