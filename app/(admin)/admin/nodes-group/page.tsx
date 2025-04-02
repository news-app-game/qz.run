"use client";
import React, { useState,useEffect } from "react";
import NodeGroupTableBox from "@/components/NodeGroupTableBox";
import { getNodeGroupsList } from "@/api/admin/nodes"
const NodesGroup =  () => {
   const [grouplist,setGrouplist] = useState([])
  const getData = async () => { 
    const res: {code:number,data:any} = await getNodeGroupsList()
    if (res.code === 200) { 
      setGrouplist(res.data)
    }
  }
  useEffect(() => { 
    getData()
  },[])
  
  return (
    <div className="flex gap-4 flex-wrap">
      {grouplist.map((item: {id:number},index:number) => (
          <div className="w-[calc(50%-8px)]" key={item.id}>
          <NodeGroupTableBox row={item as { id: string | number; name: string;nodes:any[] }} />
          </div>
        )
      )}
    </div>
  );
};

export default NodesGroup;
