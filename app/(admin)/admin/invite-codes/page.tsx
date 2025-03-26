'use client';

import * as React from "react";
import { useEffect, useState } from 'react';
import { adminFetch } from '../utils/fetch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";



interface InviteCode {
  id: number;
  code: string;
  created_at: string;
  status: boolean;
  used_by: string | null;
  used_at: string | null;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  invite_codes: InviteCode[];
  meta: PaginationMeta;
}

export default function InviteCodeManagement() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCodes(1);
  }, [statusFilter]);

  const fetchCodes = async (page: number) => {
    try {
      const statusQuery = statusFilter !== 'all' ? `&status=${statusFilter === 'used'}` : '';
      const response = await adminFetch<ApiResponse>(`/admin/invite/codes?page=${page}&per_page=${meta.per_page}${statusQuery}`);
      setCodes(response.invite_codes || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取邀请码列表失败');
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchCodes(page);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast({
          title: "复制成功",
          description: "邀请码已复制到剪贴板",
        });
      })
      .catch(err => {
        console.error('复制失败:', err);
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "无法复制到剪贴板",
        });
      });
  };


  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">邀请码管理</h1>
          <div className="text-sm text-muted-foreground text-center md:text-left">
            共 {meta.total} 个邀请码
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 md:mt-0 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setMeta(prev => ({...prev, current_page: 1}));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择状态"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="unused">未使用</SelectItem>
              <SelectItem value="used">已使用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>邀请码</TableHead>
              <TableHead className="min-w-[100px]">状态</TableHead>
              <TableHead>使用者</TableHead>
              <TableHead className="min-w-[160px]">使用时间</TableHead>
              <TableHead className="min-w-[160px]">创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.map((code) => (
              <TableRow key={`row-${code.id}`}>
                <TableCell>{code.id}</TableCell>
                <TableCell>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {code.code}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={code.status ? "secondary" : "default"}>
                    {code.status ? '已使用' : '未使用'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {code.used_by ? (
                    <span className="font-medium">{code.used_by}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {code.used_at ? (
                    new Date(code.used_at).toLocaleString()
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(code.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(code.code)}
                    disabled={code.status}
                    title="复制邀请码"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        currentPage={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
