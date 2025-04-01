"use client";
import React, { useState, useEffect,useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import XwyaForm, { FormItemsProps } from "@/components/XwyaForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { getAreaOptions, createNode,updateNode } from "@/api/admin/nodes"
import bus from "@/tools/eventBus";
import { toast } from "sonner";
interface AreaOption {
  id: number;
  name: string;
  flag_url: string;
  created_at: string;
  updated_at: string;
  status: number;
}
interface AreaOptionsApi { 
  code: number,
  data: AreaOption[]
}
interface NodeFormBody{ 
  name: string,
  node_loc_id: string,
  remark: string,
  url: string,
  connect_type: string
  status?: number
  id?: string|number
}
const nodeTypeOptions = [
  { label: "普通", value: "普通" },
  { label: "CN2", value: "CN2" },
  { label: "IPLC", value: "IPLC" },
];
const isCFOptions = [
  { label: "是", value: "1" },
  { label: "否", value: "2" },
]
const nodeForm = z.object({
  name: z.string().min(1, { message: "種類名稱不能為空" }),
  node_loc_id: z.string().min(1, { message: "請選擇區域" }),
  remark: z.string().min(1, { message: "請選擇類型" }),
  url: z.string().min(1, { message: "請輸入地址" }),
  connect_type: z.string().min(1, { message: "請選擇是否套了CF" }),
});
const Modal = () => {
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof nodeForm>>({
    resolver: zodResolver(nodeForm),
    defaultValues: {
      name: "",
      node_loc_id: "",
      remark: "",
      url: "",
      connect_type: void 0,
    },
  });
  const [areaOptions, setAreaOptions] = useState<GlobalOptions[]>([]);
  const [status, setStatus] = useState(1)
  const items = useMemo<FormItemsProps[]>(() => (
    [
      {
        type: "input",
        item: { label: "节点名称", name: "name" },
        content: { placeholder: "请输入节点名称" },
      },
      {
        type: "select",
        item: { label: "区域", name: "node_loc_id" },
        content: { placeholder: "请选择", options: areaOptions },
      },
      {
        type: "select",
        item: { label: "节点类型", name: "remark" },
        content: { placeholder: "请选择", options: nodeTypeOptions },
      },
      {
        type: "input",
        item: { label: "地址", name: "url" },
        content: { placeholder: "wws://" },
      },
      {
        type: "select",
        item: { label: "套了CF", name: "connect_type" },
        content: { placeholder: "请选择", options: isCFOptions },
      },
  
    ]
  ),[areaOptions])

  const [open, setOpen] = React.useState(true);
  const getOptions = async () => {
    try {
      const res = await getAreaOptions<AreaOptionsApi>();
      if (res.code === 200) { 
        setAreaOptions(res.data.map((item: AreaOption) => ({label: item.name, value:String(item.id) })))
      }
    } catch (err:any) { 
      console.error(err);
    }
    
   }
  const onClose = (flag: boolean) => {
    if (!flag) {
      setOpen(flag);
      router.back();
    }
  };
  const create = async (values: NodeFormBody) => { 
    try {
      const res = await createNode<Omit<AreaOptionsApi, "data">, NodeFormBody>({...values,status});
      if (res.code === 200) {
        toast.success("添加成功");
        bus.emit("updateNodes")
        onClose(false);
      }
    } catch (err) { 
      toast.error(`添加失败:${JSON.stringify(err)}`);
      console.error(err);
    }
  }
  const update =  async (values: NodeFormBody) => {
    try {
      const res = await updateNode<Omit<AreaOptionsApi, "data">, any>({...values,status,id:params!.id});
      if (res.code === 200) {
        toast.success("更新成功");
        bus.emit("updateNodes")
        onClose(false);
      }
    } catch (err) { 
      toast.error(`更新失败:${JSON.stringify(err)}`);
      console.error(err);
    }
  }
  const onFinish = async (values: NodeFormBody) => {
  
    if (params.id === "0") {
      create(values)
    } else { 
      update(values)
    }
   
  };
  useEffect(() => { 
    if (params.id != "0") { 
      try { 
        let nodeinfo: any = sessionStorage.getItem(`node-${params.id}`)
        let formdata: NodeFormBody
        if (!!nodeinfo) {
          nodeinfo = JSON.parse(nodeinfo)
          setStatus(nodeinfo.status ? 1 : 0)
          formdata = {
            name: nodeinfo.name,
            node_loc_id: String(nodeinfo.node_loc.id),
            remark: nodeinfo.remark,
            url: nodeinfo.url,
            connect_type:String(nodeinfo.connect_type)
          }
          form.reset(formdata)
        } 
      
      }catch (err) {
         console.error("err:",err);
      }
    
    }
    getOptions()
    return () => { 
      sessionStorage.removeItem(`node-${params.id}`)
    }
  },[])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{params.id === "0" ? "添加节点" : "编辑节点"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <XwyaForm items={items} form={form} onFinish={onFinish}>
          <div className="flex justify-end gap-2 w-full mt-4">
            <Button variant="outline">取消</Button>
            <Button className="!bg-[#1677FF]" type="submit" >
               {params.id === "0" ? "添加" : "保存"}
            </Button>
          </div>
        </XwyaForm>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
