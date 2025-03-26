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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import Image from "next/image";

interface Feedback {
  id: number;
  email: string;
  content: string;
  created_at: string;
  images?: string[];
  version?: string;
  platform?: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  feedbacks: Feedback[];
  meta: PaginationMeta;
}

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks(meta.current_page);
  }, []);

  const fetchFeedbacks = async (page: number) => {
    try {
      const response = await adminFetch<ApiResponse>(`/admin/feedbacks?page=${page}&per_page=${meta.per_page}`);
      setFeedbacks(response.feedbacks || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取反馈列表失败');
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchFeedbacks(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条反馈吗？')) return;

    try {
      await adminFetch(`/admin/feedbacks/${id}`, {
        method: 'DELETE',
      });
      fetchFeedbacks(meta.current_page);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除反馈失败');
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">用户反馈</h1>
          <div className="text-sm text-muted-foreground">
            共 {meta.total} 条反馈
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[200px]">邮箱</TableHead>
              <TableHead className="min-w-[400px]">反馈内容</TableHead>

              <TableHead className="min-w-[100px]">版本</TableHead>
              <TableHead className="min-w-[100px]">平台</TableHead>
              <TableHead className="min-w-[160px]">提交时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={`row-${feedback.id}`}>
                <TableCell>{feedback.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{feedback.email}</span>
                </TableCell>
                <TableCell>
                  <div className="max-w-md break-words">{feedback.content}</div>
                  {feedback.images && feedback.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {feedback.images.map((image, index) => (
                        <a
                          key={index}
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Image
                            src={image}
                            alt={`反馈图片 ${index + 1}`}
                            width={64}
                            height={64}
                            className="h-16 w-auto object-cover rounded border border-gray-200 hover:border-blue-500"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </TableCell>

                <TableCell>{feedback.version || '-'}</TableCell>
                <TableCell>{feedback.platform || '-'}</TableCell>
                <TableCell>
                  {new Date(feedback.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(feedback.id)}
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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