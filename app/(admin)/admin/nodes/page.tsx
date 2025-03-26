'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { adminFetch } from '../utils/fetch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface Node {
  id: number;
  name: string;
  // 在线人数
  online_users_count: number;
  // 总流量数
  total_traffic_count: string;
  // 上行流量（30min）
  average_upstream_traffic: string;
  // 下行流量（30min）
  average_downstream_traffic: string;
  created_at: string;
  url: string;
  status: boolean;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  nodes: Node[];
  meta: PaginationMeta;
}

export default function NodeManagement() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 50,
    total: 0,
    last_page: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchNodes(meta.current_page);
  }, []);
  
  const fetchNodes = async (page: number) => {
    try {
      const response = await adminFetch<ApiResponse>(`/admin/nodes?page=${page}&per_page=${meta.per_page}`);
      setNodes(response.nodes || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取节点列表失败');
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchNodes(page);
  };
  
  const toggleNodeStatus = async (nodeId: number, currentStatus: boolean) => {
    try {
      await adminFetch(`/admin/nodes/${nodeId}/status`, {
        method: 'PUT',
        body: JSON.stringify({status: !currentStatus}),
      });
      // 重新获取节点列表以更新状态
      fetchNodes(meta.current_page);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '更新节点状态失败');
    }
  };
  
  const getNodeStatus = (status: boolean) => {
    switch (status) {
      case true:
        return {label: '正常', variant: 'default' as const};
      case false:
        return {label: '维护中', variant: 'secondary' as const};
    }
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
        <h1 className="text-3xl font-bold tracking-tight">节点管理</h1>
        <div className="text-sm text-muted-foreground">
          共 {meta.total} 个节点
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[80px]">名称</TableHead>
              <TableHead>地址</TableHead>
              <TableHead className="min-w-[80px]">状态</TableHead>
              <TableHead className="min-w-[100px]">在线人数</TableHead>
              <TableHead className="min-w-[100px]">总流量数</TableHead>
              <TableHead className="min-w-[160px]">上下行流量（30min）</TableHead>
              <TableHead className="min-w-[160px]">创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow key={`row-${node.id}`}>
                <TableCell>{node.id}</TableCell>
                <TableCell>{node.name}</TableCell>
                <TableCell>{node.url}</TableCell>
                <TableCell>
                  <Badge
                    variant={getNodeStatus(node.status).variant}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleNodeStatus(node.id, node.status)}
                  >
                    {getNodeStatus(node.status).label}
                  </Badge>
                </TableCell>
                <TableCell>{node.online_users_count || '-'}</TableCell>
                <TableCell>{node.total_traffic_count || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ArrowUp size='16'/>
                    <span>{node.average_upstream_traffic || '---'}</span>
                    <span className="px-2"></span>
                    <ArrowDown size='16'/>
                    <span>{node.average_downstream_traffic || '---'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(node.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Pagination>
        <PaginationContent>
          {meta.current_page > 1 && (
            <PaginationItem key="prev">
              <PaginationPrevious
                onClick={() => handlePageChange(meta.current_page - 1)}
                className="cursor-pointer"
                size="sm"
              />
            </PaginationItem>
          )}
          
          {Array.from({length: meta.last_page}, (_, i) => i + 1)
            .filter(page => {
              const nearCurrent = Math.abs(page - meta.current_page) <= 1;
              const isFirstOrLast = page === 1 || page === meta.last_page;
              return nearCurrent || isFirstOrLast;
            })
            .map((page, index, array) => {
              const items = [];
              
              if (index > 0 && array[index - 1] !== page - 1) {
                items.push(
                  <PaginationItem key={`ellipsis-${page}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                );
              }
              
              items.push(
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={meta.current_page === page}
                    size="sm"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
              
              return items;
            }).flat()}
          
          {meta.current_page < meta.last_page && (
            <PaginationItem key="next">
              <PaginationNext
                onClick={() => handlePageChange(meta.current_page + 1)}
                className="cursor-pointer"
                size="sm"
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
