"use client";
import React, { useState } from "react";
import type { Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { PageType } from "@/hooks/use-page";

export type TableColumns<T> = {
  id?: string
  key?: string
  header?: string
  cell?: React.ReactNode | ((item: T) => React.ReactNode | string) 
  className?: string
  headCell?: React.ReactNode | (()=> React.ReactNode | string)
};

type XwyaTableProps<T> = {
  data: T[]
  columns: TableColumns<T>[];
  total?: number
  onChange?: (current_page:number) => void
  page?: PageType
  loading?: boolean
  className?: string
  rowKey?:string
};

const XwyaTable = <T extends Record<string, any>,>({
  data = [],
  columns = [],
  total = 1,
  onChange,
  page,
  loading,
  className,
  rowKey= 'id'
}: XwyaTableProps<T>) => {
  return (
    <div className={className}>
      <div className="  flex-1">
        <Table className=" h-full   w-full">
          <TableHeader className="bg-[rgba(0,0,0,0.02)]">
            <TableRow>
              {columns.map((item:TableColumns<T>,index:number) => (
                <TableHead key={item.id as Key || item.key as Key} className={`text-[rgba(0,0,0,0.88)] py-2 font-bold ${item.className}` }>
                  <div className="pr-2" style={{borderRight:index === columns.length - 1 ? 'none' : '1px solid #F0F0F0'}}>{  typeof item.headCell === 'function' ? item.headCell() : item.headCell ||item.header}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item:T) => (
              <TableRow key={item[rowKey] as Key} className="last:!border-b">
                {columns.map((column:TableColumns<T>) => (
                  <TableCell
                    key={column.id as Key || column.key as Key}
                    className={column.className}
                  >
                    {typeof column.cell === 'function'?column.cell(item) : column.cell || String((column.key as string).split('.').reduce((acc, key) => acc && acc[key], item))  }{" "}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {!loading && !!!total && !!!data.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无数据.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell className=" absolute inset-0 flex justify-center bg-[rgba(255,255,255,0.6)] dark:bg-[rgba(0,0,0,.3)] items-center  z-20">
                  正在加载...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {page &&
        <div className="my-4">
          <DataTablePagination
            currentPage={page.page}
            lastPage={page.last_page}
            onPageChange={onChange || (() => {})}
          />
        </div>}
    </div>
  );
};
export default XwyaTable;
