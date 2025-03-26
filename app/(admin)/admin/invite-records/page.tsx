'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { adminFetch } from '../utils/fetch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";


interface InviteRecord {
  id: number;
  inviter_email: string;
  invitee_email: string;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  invite_records: InviteRecord[];
  meta: PaginationMeta;
}

export default function InviteRecordManagement() {
  const [records, setRecords] = useState<InviteRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchRecords(meta.current_page);
  }, []);
  
  const fetchRecords = async (page: number) => {
    try {
      const response = await adminFetch<ApiResponse>(`/admin/invite/records?page=${page}&per_page=${meta.per_page}`);
      setRecords(response.invite_records || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取邀请记录失败');
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">邀请记录</h1>
        <div className="text-sm text-muted-foreground">
          共 {meta.total} 条记录
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>邀请人</TableHead>
              <TableHead>被邀请人</TableHead>
              <TableHead className="min-w-[160px]">邀请时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={`row-${record.id}`}>
                <TableCell>{record.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{record.inviter_email}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{record.invitee_email}</span>
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
