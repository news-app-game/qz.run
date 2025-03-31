import React, { Key } from "react";

export type TableColumns<T> = {
  title: string;
  key:  keyof T; 
  headCell?: React.ReactNode | (()=> React.ReactNode);
  cell?: (item: T) => React.ReactNode;
  width?:number
}
 type AdaptTableProps<T> ={
  rowKey?: keyof T;
  columns: TableColumns<T>[];
  data: T[];
}




const AdaptTable = <T,>(props: AdaptTableProps<T>) => {
  const { columns, data,rowKey } = props;
  return (
    <div className="w-full overflow-auto">
  <table className=" w-full  table-auto">
      <thead className="bg-[rgba(0,0,0,0.02)] text-left border-b border-[#F0F0F0]">
        <tr >
          {columns.map((item:TableColumns<T>,index:number) => (
            <th className="py-2" key={item.key as Key} style={{width:item.width}} >
              <div className="px-2 w-full" style={{borderRight:index === columns.length - 1 ? 'none' : '1px solid #F0F0F0'}}>{  typeof item.headCell === 'function' ? item.headCell() : item.headCell || item.title}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {data.map((item) => (
          <tr className="border-b border-[#F0F0F0]" key={item[rowKey as keyof T || "id" as keyof T] as Key} >
            {columns.map((column: TableColumns<T>) => (
              <td className="p-2 " key={column.key as Key } style={{width:column.width}} >
                <div className="w-full">{ column.cell ? column.cell(item) : item[column.key] as string | number}</div>
              </td>
            ))}
        </tr>
        ))}

      </tbody>
    </table>
    </div>
  
  );
};

export default AdaptTable;
