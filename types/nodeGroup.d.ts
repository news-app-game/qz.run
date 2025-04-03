declare namespace NodeGroup {
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
  
  type NodeGroupRequestBody = {
    id?: number;
    name: string;
    nodes: Node[];
  };
  // type ApiResponse ={
  //   code: number
  //   data:any
  // }
}