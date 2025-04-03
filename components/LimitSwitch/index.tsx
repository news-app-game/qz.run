"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
type SelectOptons = {
  label: string;
  value: string;
};
const options: SelectOptons[] = [
  { label: "天", value: "0" },
  { label: "周", value: "1" },
  { label: "月", value: "2" },
];
export type LimitSwitchData<T> = {
  uint: string
  title: string
  switchKey: T
  dateKey: T
  valueKey: T
}

type LimitSwitchProps<T> = {
  item: LimitSwitchData<T> 
  onChange: (key: string, value: any) => void
  data:any
}
const LimitSwitch = <T,>(props: LimitSwitchProps<T>) => {
  const { item, onChange, data } = props
  const [open,setOpen] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<SelectOptons | null>(
    options[0]
  );
  return (
    <div>
      <div className="flex items-center space-x-2 ">
        <Switch
          id="airplane-mode"
          className="data-[state=checked]:bg-[#1677FF]"
          checked={data[item.switchKey]}
          onCheckedChange={(value) => {
            onChange(item.switchKey as string, value);
          }
          }
        />
        <Label className="text-sm text-rgba(0,0,0,.88)" htmlFor="airplane-mode">
          {item.title}
        </Label>
      </div>
      {data[item.switchKey] &&
       <div className="flex items-center space-x-2 mt-1">
       <div className="shrink-0">
        
         <Popover open={open} onOpenChange={setOpen}>
           <PopoverTrigger asChild>
             {/* <Button variant="outline" className="w-[150px] justify-start">
               
             </Button> */}
             <span className="flex cursor-pointer text-[#1677FF] items-center text-sm"> <span className="mr-2 text-[rgba(0,0,0,.88)]">每</span> {selectedStatus ? <>{selectedStatus.label}</> : <>天</>} <ChevronDown width={14} height={14} className="ml-1" /> </span>
           </PopoverTrigger>
           <PopoverContent className="p-0 w-[70px]"  align="start">
             <Command>
               <CommandList>
                 <CommandEmpty>请选择时间</CommandEmpty>
                 <CommandGroup>
                   {options.map((itemb) => (
                     <CommandItem
                       key={itemb.value}
                       value={itemb.value}
                       onSelect={(value) => {
                         let obj =  options.find(
                           (priority) => priority.value === value
                         )
                         setSelectedStatus(obj as SelectOptons);
                         onChange(item.valueKey as string ,obj?.value);
                         setOpen(false);
                       }}
                     >
                       {itemb.label}
                     </CommandItem>
                   ))}
                 </CommandGroup>
               </CommandList>
             </Command>
           </PopoverContent>
         </Popover>
       </div>
       <div className="flex items-center space-x-2">
         <Input className="w-10 h-6" value={data[item.valueKey]}  onChange={(e) => {
           onChange(item.valueKey as string, e.target.value);
         }} />
         <span className="shrink-0 text-sm">{ item.uint}</span>
       </div>
     </div>}
     
    </div>
  );
};

export default LimitSwitch;
