'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { adminFetch } from '../utils/fetch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RewardRecord {
  id: number;
  email: string;
  created_at: string;
  duration_description: string;
  type_description: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  rewards: RewardRecord[];
  meta: PaginationMeta;
}

export default function RewardRecordManagement() {
  const [records, setRecords] = useState<RewardRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchRecords(meta.current_page);
  }, [typeFilter]);
  
  const fetchRecords = async (page: number) => {
    try {
      const typeQuery = (typeFilter !== 'all' && typeFilter !== '') ? `&type=${typeFilter}` : '';
      const response = await adminFetch<ApiResponse>(`/admin/rewards?page=${page}&per_page=${meta.per_page}${typeQuery}`);
      setRecords(response.rewards || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取奖励记录失败');
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchRecords(page);
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
          <h1 className="text-3xl font-bold tracking-tight">奖励记录</h1>
          <div className="text-sm text-muted-foreground text-center md:text-left">
            共 {meta.total} 条记录
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 md:mt-0 w-full md:w-auto">
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setMeta(prev => ({...prev, current_page: 1}));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择奖励类型"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="1">邀请奖励</SelectItem>
              <SelectItem value="2">活动奖励</SelectItem>
              <SelectItem value="3">管理员赠送</SelectItem>
              <SelectItem value="4">购买赠送</SelectItem>
              <SelectItem value="5">使用官方邀请码注册奖励</SelectItem>
              <SelectItem value="6">每天赠送一小时</SelectItem>
              <SelectItem value="7">通过用户邀请码注册奖励</SelectItem>
              <SelectItem value="8">管理员扣除</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>用户</TableHead>
              <TableHead className="min-w-[180px]">奖励类型</TableHead>
              <TableHead className="min-w-[80px]">奖励时长</TableHead>
              <TableHead className="min-w-[160px]">奖励时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={`row-${record.id}`}>
                <TableCell>{record.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{record.email}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {record.type_description}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">
                    {record.duration_description}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(record.created_at).toLocaleString()}
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
