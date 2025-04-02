"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import XwyaTable, { TableColumns } from "@/components/XwyaTable";
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
import { cn } from "@/lib/utils";
import AddNodeDrawer from "@/components/AddNodeDrawer";
import Image from "next/image";
import bus from "@/tools/eventBus";
import { getNodeGroupInfo,deleteNodeGroup } from "@/api/admin/nodes";
import { formatDate } from "@/tools/day"
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
interface GenerateNodeGroupProps {
  searchParams: Promise<{
    id?: string;
  }>;
}
interface NodeLocation {
  id: number;
  name: string;
  flag: string;
  status: number;
  created_at: string;
}
interface Node  {
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

interface RequestBody {
  name: string;
  nodes: Node[];
}


let defaultValue: RequestBody = {
  name: "",
  nodes: [],
};
const GenerateNodeGroup = () => {
  const params: { id: string } = useParams()
  const router = useRouter()
  const [formBody, setFormBody] = useState<RequestBody>(defaultValue);
  const [open, setOpen] = useState<boolean>(false)
  const [row, setRow] = useState<Node | null>(null)
  const [deleteOpen,setDeleteOpen] = useState<boolean>(false)
  const hasChanged = useMemo(() => {
    return JSON.stringify(formBody) !== JSON.stringify(defaultValue);
  }, [formBody]);
  const columns: TableColumns<Node>[] = [
    {
      key: "name",
      header: "节点名",
    },
    { key: "node_loc.name", header: "区域" },
    { key: "remark", header: "节点类型" },
 
        {
          key: "connect_type",
          header: "套了CF",
          cell: (row: Node) => (<div>{ row.connect_type===1?"是":"否" }</div>)
           },
          {
            key: "status",  header: "状态",
            headCell: () => (
              <div className='w-full flex justify-between items-center'>
                <span>状态</span>
                <Image  className="w-auto h-auto" width={24} height={24} src="/FilterFilled.svg" alt="" />
              </div>
            ),
            cell: (row:Node) => (
              <div className={cn("w-10 h-[22px]  border  rounded-sm text-xs  flex justify-center items-center",row.status?" border-[#B7EB8F] text-[#52C41A] bg-[##F6FFED]":"bg-[#FFF1F0] border-[#FFA39E] text-[#F5222D]") }>{row.status?"启用":"停用" }</div>
            )
          },
    { key: "added_at", header: "添加时间",cell: (row:Node) => (<div>{ formatDate(row.added_at) }</div>) },
    {
      key: "id",
      header: "操作",
      cell:(row)=> (
        <div className="cursor-pointer text-[#007AFF]" onClick={()=>onOpen(row)}>移除</div>
      ),
    },
  ];

  const onInputChange = (value: string) => {
    setFormBody((prev) => ({ ...prev, name: value }));
  };

  const onNodesChange = (key: "remove" | "create", value: Node) => {
    if (key === "remove") {
      setFormBody((prev) => ({
        ...prev,
        nodes: prev.nodes.filter((item) => item.id !== value.id),
      }));
    } else {
      // 判断是否已经存在
      if (formBody.nodes.some((item) => item.id === value.id)) {
        toast.error("节点已添加");
        return 
      }
      setFormBody((prev) => ({ ...prev, nodes: [...prev.nodes, value] }));
    }
  };
  const onOpen = (row: Node) => {
    setRow(row)
    setOpen(true)
  }
  const onRemove = () => { 
    if (formBody.nodes.length === 1) {
      toast.error("不能删除最后一个节点")
    } else { 
      onNodesChange("remove", row as Node)
    }
   
    setRow(null)
    setOpen(false)
  }
  const onChangeOpen = (flag: boolean, type: number) => { 
    if (type === 1) {
      setOpen(flag)
    } else { 
      setDeleteOpen(flag)
    }
    
  }
  const getLoadDefautlValue = async () => {
    try { 
      const res: {code:number,data:any} = await getNodeGroupInfo(params!.id)
    if (res.code === 200) { 
      defaultValue = res.data
      setFormBody(res.data)
    }
    } catch (e) { 
        
    }
    
  }
  const onDeleteGroup = async () => { 
    try { 
      const res = await deleteNodeGroup(params.id) as {code:number}
      if (res.code === 200) {
        toast.success("删除成功")
        router.push("/admin/nodes-group")
      }
    } catch (error) { 
      console.log(error);
      
    }
  }
  useEffect(() => { 
    if (params.id != "0") { 
      getLoadDefautlValue()
    }
  },[])

  useEffect(() => { 
    bus.emit("changeGroupValue",hasChanged)
  }, [hasChanged])
  useEffect(() => { 
    bus.emit("saveNodesGroup",formBody)
  },[formBody])
  return (
    <div>
      <div>
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          基础信息
        </div>
        <div className="mt-[10px]">
          <div>
            <Label htmlFor="base_name">名称</Label>
            <Input
              id="base_name"
              type="text"
              value={formBody.name}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="请输入名称"
              className="lg:w-[400px] h-8 mt-1"
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="text-base text-rgba(0,0,0,0.88) font-bold ">
          包含节点（{formBody.nodes.length}）
        </div>
        <AddNodeDrawer onChange={ (value:Node)=>onNodesChange("create",value)}>
          <div className="flex items-center gap-2 my-[10px] w-[112px] h-8 rounded-md border-dotted border border-[#D9D9D9] cursor-pointer text-sm text-[rgba(0,0,0,0.88)] justify-center">
            <Plus width={16} height={16} />
            <span>添加节点</span>
          </div>
        </AddNodeDrawer>
        <div>
          <XwyaTable<Node> data={formBody.nodes} total={0} columns={columns} />
        </div>
        { params.id != "0" && <div className="mt-8" ><Button className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-[102px] h-8" onClick={()=>setDeleteOpen(true)}>删除节点组</Button> </div>} 
      </div>
      <AlertDialog open={open} onOpenChange={(f:boolean)=>onChangeOpen(f,1)}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent className="lg:w-[412px]">
          <AlertDialogHeader>
            <AlertDialogTitle>确定移除节点：{ row &&row.name } ？</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-15 h-8">取消</AlertDialogCancel>
            <AlertDialogAction onClick={onRemove} className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-15 h-8">
              移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteOpen} onOpenChange={(f:boolean)=>onChangeOpen(f,2)}>
        <AlertDialogTrigger asChild>
        </AlertDialogTrigger>
        <AlertDialogContent className="lg:w-[412px]">
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除节点组？？</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-15 h-8">取消</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteGroup} className="bg-[#FF3B30] hover:bg-[#FF3B30] text-white w-15 h-8">
              移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GenerateNodeGroup;
