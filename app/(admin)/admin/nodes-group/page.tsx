"use client";
import React, { useState,useEffect } from "react";
import NodeGroupTableBox from "@/components/NodeGroupTableBox";
import { getNodeGroupsList } from "@/api/admin/nodes"
type NodeLocation = {
  id: number;
  name: string;
  flag: string;
  status: number;
  created_at: string;
  updated_at: string;
};

type Node = {
  id: number;
  name: string;
  url: string;
  status: boolean;
  connect_type: number;
  remark: string | null;
  added_at: string;
  node_loc: NodeLocation;
};

type Data = {
  id: number;
  name: string;
  nodes: Node[];
};
type ApiResponse = {
  code: number;
  data: Data[];
}
const NodesGroup =  () => {
   const [grouplist,setGrouplist] = useState<Data[]>([])
  const getData = async () => { 
    const res = await getNodeGroupsList<ApiResponse>()
    if (res.code === 200) { 
      setGrouplist(res.data)
    }
  }
  useEffect(() => { 
    getData()
  },[])
  
  return (
    <div className="flex gap-4 flex-wrap">
      {grouplist.map((item:Data) => (
          <div className="w-[calc(50%-8px)]" key={item.id}>
          <NodeGroupTableBox<Data> row={item} />
          </div>
        )
      )}
    </div>
  );
};

export default NodesGroup;
