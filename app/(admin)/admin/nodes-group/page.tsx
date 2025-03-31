import React from "react";
import NodeGroupTableBox from "@/components/NodeGroupTableBox";
const NodesGroup = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from(
        { length: 3 }).map((_, index) => (
          <div className="w-[calc(50%-8px)]">
            <NodeGroupTableBox />
          </div>
        )
      )}
    </div>
  );
};

export default NodesGroup;
