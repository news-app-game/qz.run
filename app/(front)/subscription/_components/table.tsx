"use client"
import { useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize: number
  currentPage: number
  total: number
  onPageChange: (page: number) => void
  loading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize,
  currentPage,
  total,
  onPageChange,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: total,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  })
  const totalPages = useMemo(() => {
    const totalPage = Math.ceil(total / pageSize)
    return totalPage
  }, [total, pageSize])

  return (
    <div className="flex flex-col w-full">
      <div className="rounded-md">
        <Table>
          <TableHeader className="bg-[#00000005]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-[500] text-[#000000E0]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) :
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-sm text-muted-foreground">
            第 {currentPage} 页，共 {totalPages} 页
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
