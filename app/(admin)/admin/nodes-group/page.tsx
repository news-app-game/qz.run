"use client";
import React, { useEffect} from "react";
import NodeGroupTableBox from "@/components/NodeGroupTableBox";
import { getNodeGroupsList } from "@/api/admin/nodes"
const NodesGroup =  () => {
  // try {
  //   const grouplist = await getNodeGroupsList()
  //   console.log(grouplist);
  // } catch (err) { 
  //   console.log(err);
    
  // }
  const getData = async () => { 
    const grouplist = await getNodeGroupsList()
    console.log(grouplist);
    
  }
  useEffect(() => { 
    getData()
  },[])
  
  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from(
        { length: 3 }).map((_, index) => (
          <div className="w-[calc(50%-8px)]" key={index}>
            <NodeGroupTableBox />
          </div>
        )
      )}
    </div>
  );
};

export default NodesGroup;
