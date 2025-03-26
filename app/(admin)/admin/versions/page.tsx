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
import { Download } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Version {
  id: number;
  version: string;
  created_at: string;
  platform: string;
  download_url: string;
  force_update: boolean;
  status: boolean;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  versions: Version[];
  meta: PaginationMeta;
}

export default function VersionManagement() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVersions(meta.current_page);
  }, []);

  const fetchVersions = async (page: number) => {
    try {
      const response = await adminFetch<ApiResponse>(`/admin/versions?page=${page}&per_page=${meta.per_page}`);
      setVersions(response.versions || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取版本记录失败');
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchVersions(page);
  };

  const updateVersionStatus = async (id: number, status: boolean) => {
    try {
      await adminFetch(`/admin/versions/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      
      // 更新本地状态
      setVersions(versions.map(version =>
        version.id === id ? { ...version, status } : version
      ));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '更新版本状态失败');
    }
  };

  const getPlatformBadge = (platform: string) => {
    const variants: { [key: string]: "default" | "secondary" | "outline" } = {
      android: "default",
      ios: "secondary",
      windows: "outline"
    };
    return variants[platform.toLowerCase()] || "outline";
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
        <h1 className="text-3xl font-bold tracking-tight">版本记录</h1>
        <div className="text-sm text-muted-foreground">
          共 {meta.total} 个版本
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[60px]">版本号</TableHead>
              <TableHead className="min-w-[120px]">平台</TableHead>
              <TableHead className="min-w-[80px]">强制更新</TableHead>
              <TableHead className="min-w-[100px]">状态</TableHead>
              <TableHead className="min-w-[160px]">发布时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {versions.map((version) => (
              <TableRow key={`row-${version.id}`}>
                <TableCell>{version.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{version.version}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={getPlatformBadge(version.platform)}>
                    {version.platform}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={version.force_update ? "destructive" : "outline"}>
                    {version.force_update ? '是' : '否'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={version.status ? "default" : "secondary"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => updateVersionStatus(version.id, !version.status)}
                  >
                    {version.status ? '已发布' : '未发布'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(version.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open('/'+version.download_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
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
          
          {Array.from({ length: meta.last_page }, (_, i) => i + 1)
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
