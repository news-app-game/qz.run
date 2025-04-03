"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Bell,
  Gift,
  History,
  Home,
  HelpCircle,
  LucideProps,
  Network,
  Ticket,
  UserPlus,
  Users,
  Cog,
  MapPinned,
  Link2Icon,
  ChartColumn,
  Server,
  MonitorCog,
  NotepadText,
} from "lucide-react";
import Link from "next/link";
import * as react from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createNodeGroup, updateNodeGroup } from "@/api/admin/nodes";
import { createThali,updateThali } from "@/api/admin/thali";
import bus from "@/tools/eventBus";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SidebarItem = {
  title: string;
  url: string;
  icon: react.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
  >;
  items: Omit<SidebarItem,"items"|"icon"> [];
};

// const items: SidebarItem[] = [
//   {
//     title: "控制台",
//     url: "/admin",
//     icon: Home,
//   },
//   {
//     title: "用户管理",
//     url: "/admin/users",
//     icon: Users,
//   },
//   {
//     title: "邀请码",
//     url: "/admin/invite-codes",
//     icon: Ticket,
//   },
//   {
//     title: "邀请记录",
//     url: "/admin/invite-records",
//     icon: UserPlus,
//   },
//   {
//     title: "奖励记录",
//     url: "/admin/rewards-records",
//     icon: Gift,
//   },
//   {
//     title: "节点列表",
//     url: "/admin/nodes",
//     icon: Network,
//   },
//   {
//     title: "区域管理",
//     url: "/admin/nodes-loc",
//     icon: MapPinned,
//   },
//   {
//     title: "系统配置",
//     url: "/admin/site-configs",
//     icon: Cog,
//   },
//   {
//     title: "公告管理",
//     url: "/admin/announcements",
//     icon: Bell,
//   },

//   {
//     title: "版本记录",
//     url: "/admin/versions",
//     icon: History,
//   },
//   {
//     title: "连接日志",
//     url: "/admin/connection-logs",
//     icon: Link2Icon,
//   },
//   {
//     title: "用户反馈",
//     url: "/admin/feedbacks",
//     icon: HelpCircle,
//   },
// ];
// const SidebarMenuLink = ({ item }: { item: SidebarItem }) => {
//   const { setOpenMobile } = useSidebar();
//   return (
//     <SidebarMenuItem key={item.title}>
//       <SidebarMenuButton asChild>
//         <Link
//           href={item.url}
//           onClick={() => setOpenMobile(false)}
//           className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
//         >
//           <item.icon className="h-5 w-5" />
//           <span>{item.title}</span>
//         </Link>
//       </SidebarMenuButton>
//     </SidebarMenuItem>
//   );
// };
const newItems: SidebarItem[] = [
  {
    title: "数据看板",
    url: "#",
    icon: ChartColumn,
    items: [
      { title: "总看板", url: "/admin" },
      { title: "用户", url: "#" },
      { title: "流量", url: "#" },
    ],
  },
  {
    title: "用户与邀请",
    url: "#",
    icon: Users,
    items: [
      { title: "用户管理", url: "/admin/users" },
      { title: "邀请码", url: "/admin/invite-codes" },
      { title: "邀请记录", url: "/admin/invite-records" },
      { title: "奖励记录", url: "/admin/rewards-records" },
      { title: "用户反馈", url: "/admin/feedbacks" },
    ],
  },
  {
    title: "套餐与节点",
    url: "#",
    icon: Server,
    items: [
      { title: "区域管理", url: "/admin/nodes-loc" },
      { title: "节点", url: "/admin/nodes" },
      { title: "节点组", url: "/admin/nodes-group" },
      { title: "套餐", url: "/admin/thali" },
    ],
  },
  {
    title: "系统与公告",
    url: "#",
    icon: MonitorCog,
    items: [
      { title: "系统配置", url: "/admin/site-configs" },
      { title: "公告管理", url: "/admin/announcements" },
      { title: "版本记录", url: "/admin/versions" },
    ],
  },
  {
    title: "日志",
    url: "#",
    icon: NotepadText,
    items: [{ title: "连接日志", url: "/admin/connection-logs" }],
  },
];

let numberKey = ["max_online_devices", "monthly_price", "time_limit", "traffic_limit", "time_period", "traffic_period"];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({
    group: false,
    thali:false
  });
  const [groupBody, setGroupBody] = useState<NodeGroup.NodeGroupRequestBody>()
  const [thaliBody, setThaliBody] = useState<Record<string, any>>({});
  const pathname = usePathname();
  const router  = useRouter()

 const removeLastPathSegment=(url:string):string=> {
   const [path, query] = url.split("?"); // 分离路径和查询参数
   
   const basePath = path.split("/").filter(Boolean).slice(0, 2).join("/"); // 去掉最后一个路径部分
   
    return query ? `/${basePath}?${query}` : `/${basePath}`; // 重新拼接
  }
  const createNodeGroupSave = async () => { 
    try {
      const res: {code:number} = await createNodeGroup(groupBody)
      if (res.code === 200) { 
        toast.success("保存成功")
        router.push("/admin/nodes-group")
       }
     }
    catch (error) {
      toast.error(`保存失败 ${error}`)
    }
  }
  const updateNodeGroupSave = async () => {
    try {
      const res = await updateNodeGroup<{code:number},Required<NodeGroup.NodeGroupRequestBody>>(groupBody as Required<NodeGroup.NodeGroupRequestBody>)
      if (res.code === 200) { 
        toast.success("保存成功")
        router.push("/admin/nodes-group")
       }
     }
    catch (error) {
      toast.error(`保存失败 ${error}`)
    }
  }
  const onSaveGroup = () => {
    if (!groupBody?.name) { 
      toast.error("节点组名称不能为空")
      return
    }
    if (!groupBody?.nodes.length) {
      toast.error("节点组节点不能为空")
      return
    }
    if (groupBody?.id) {
      updateNodeGroupSave()
    } else { 
      createNodeGroupSave()
    }
  }
  const createThaliSave = async (body:any) => {
    try {
    
      // let new_node_group_ids = thaliBody.node_group_ids.map((item: any) => (item.id))
      const res = await createThali(body) as any
      if (res.code === 200) {
        toast.success("保存成功")
        router.push("/admin/thali")
      }
     } catch (err) { 
      console.log(err);
      
    }
  }
  const updateThaliSave = async (body:any) => {
    try {

      // console.log("更新数据",{...thaliBody, other_benefits: new_other_benefits,node_groups: node_groups});
      const res = await updateThali(body) as any
      if (res.code === 200) {
        toast.success("保存成功")
        router.push("/admin/thali")
      }
     } catch (err) { 
      console.log(err);

    }
  }
  const onSaveThali = () => {
    let requestBody = {...thaliBody}
    requestBody.other_benefits = requestBody.other_benefits.map((item: any) => (item.value)).filter(Boolean)
    requestBody.node_groups = requestBody.node_groups.map((item: any) => { 
      for (const key in item) { 
        if (numberKey.includes(key)) { 
          item[key] = Number(item[key])
        }
      }
      item.is_time_limited = item.is_time_limited ? 1 : 0
      item.is_traffic_limited = item.is_traffic_limited ? 1 : 0
      delete item.nodes
      delete item.name
      return item
    })
    
    requestBody.is_time_limited = requestBody.is_time_limited ? 1 : 0
    requestBody.is_traffic_limited = requestBody.is_traffic_limited ? 1 : 0
    
    for (const key in requestBody) { 
      if (numberKey.includes(key)) { 
        requestBody[key] = Number(requestBody[key])
      }
    } 
    console.log(requestBody);
    if (!requestBody.name) { 
      toast.error("套餐名称不能为空")
      return
    }
    if (thaliBody.id) {
      updateThaliSave(requestBody)
    } else{ 
       createThaliSave(requestBody)
    }
    // console.log({...thaliBody, other_benefits: new_other_benefits})
  }
  const onLoadBus = () => { 
    bus.on("saveNodesGroup", (data: any) => {
        setGroupBody(data)
    })
  
    bus.on("changeGroupValue", (flag: boolean) => { 
      setStatusMap((prev) => ({ ...prev, group: flag }))
    })
    bus.on("saveThali", (data: any) => {
      setThaliBody(data)
  })
    bus.on("changeThaliValue", (flag: boolean) => { 
      setStatusMap((prev) => ({ ...prev, thali: flag }))
    })
  }
  const onCloseBus = () => {
    bus.off("saveNodesGroup")
    bus.off("changeGroupValue")
    bus.off("saveThali")
    bus.off("changeThaliValue")
  }
    
  const RightButtonGroup=useMemo<Record<string, react.ReactElement>>(()=>({
    "/admin":<Button variant="ghost" size="sm" asChild>
    <Link href="/" className="flex items-center space-x-2">
      <ArrowLeft className="h-4 w-4" />
      <span>返回首页</span>
    </Link>
  </Button>,
    "/admin/thali": <Button className="rounded-md w-22 h-8 !bg-[#1677FF]"><Link href={"/admin/generateThali"}>添加套餐</Link></Button>,
    "/admin/generateThali": <div className="flex gap-2 items-center">
      <Button variant="outline" className="w-15 h-8 rounded-md">取消</Button>
      { statusMap.thali ?<Button onClick={onSaveThali}  className="w-15 h-8 rounded-md !bg-[#1677FF] ">保存</Button>:  <Button className="w-15 h-8 rounded-md border border-[#D9D9D9]  !bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.25)]">保存</Button>}

    </div>,
    "/admin/nodes-group": <Button className="rounded-md w-[102px] h-8 !bg-[#1677FF]"><Link href={"/admin/generateNodeGroup/0"}>添加节点组</Link></Button>,
    "/admin/generateNodeGroup":<div className="flex gap-2 items-center">
      <Button variant="outline" className="w-15 h-8 rounded-md">取消</Button>
      { statusMap.group?<Button  className="w-15 h-8 rounded-md !bg-[#1677FF] " onClick={onSaveGroup}>保存</Button>:<Button className="w-15 h-8 rounded-md border border-[#D9D9D9]  !bg-[rgba(0,0,0,0.04)] text-[rgba(0,0,0,0.25)]">保存</Button>}
    
    
    </div>,
     "/admin/nodes": <Button className="rounded-md w-[88px] h-8 !bg-[#1677FF]"> <Link href="/admin/nodes/modal/0">添加节点</Link></Button>,
  }),[pathname,statusMap,groupBody,thaliBody]) 
  useEffect(() => {
    onLoadBus()
    // 检查是否是管理员
    const checkAdmin = () => {
      try {
        setIsAdmin(true);
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    };

    checkAdmin();
    return () => { 
      onCloseBus()
    }
  }, []);

  // 如果未认证为管理员，显示加载状态
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="pl-4 p-6">
              <h1 className="text-xl font-semibold">后台管理系统</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 gap-0">
            {newItems.map((item) => (
              <Collapsible
                key={item.title}
                title={item.title}
                defaultOpen
                className="group/collapsible"
              >
                <SidebarGroup className="p-0">
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger>
                     <item.icon className="h-5 w-5" />  
                      <span className="ml-2">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuSub>
                          {item.items.map((itemb) => (
                            <SidebarMenuSubItem key={itemb.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={itemb.url}>{itemb.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}
          </SidebarContent>
        </Sidebar>

        {/* 主要内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-card">
            <div className="h-full px-6 flex items-center justify-between">
              <SidebarTrigger />
              <h2 className="text-lg font-medium"></h2>
              {RightButtonGroup[removeLastPathSegment(pathname)]}
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>返回首页</span>
                </Link>
              </Button> */}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="max-w-[1920px]">{children}</div>
          </main>
        </div>
        {/* <Toaster /> */}
      </SidebarProvider>
    </div>
  );
}
