'use client';

import * as React from "react";
import { useEffect, useState } from 'react';
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { getNoticeList, deleteNotice, editNotice, createNotice } from "@/api/admin/notices";

export default function NoticeManagement() {
  const [notices, setNotices] = useState<API.AdminNoticeItem[]>([]);
  const [meta, setMeta] = useState<API.AdminNoticeMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<API.AdminNoticeItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: true,
    start_at: new Date(),
    end_at: new Date(),
    content: '',
  });

  useEffect(() => {
    fetchNotices(meta.current_page);
  }, []);

  const fetchNotices = async (page: number) => {
    try {
      const { data: response } = await getNoticeList({ page, per_page: meta.per_page });
      setNotices(response.notices || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取公告列表失败');
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchNotices(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条公告吗？')) return;

    try {
      await deleteNotice(id);
      fetchNotices(meta.current_page);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除公告失败');
    }
  };

  const handleOpenDialog = (notice?: API.AdminNoticeItem) => {
    if (notice) {
      setIsEditing(true);
      setCurrentNotice(notice);
      setFormData({
        title: notice.title,
        status: notice.status,
        start_at: new Date(notice.start_at),
        end_at: new Date(notice.end_at),
        content: notice.content,
      });
    } else {
      setIsEditing(false);
      setCurrentNotice(null);
      setFormData({
        title: '',
        status: true,
        start_at: new Date(),
        end_at: new Date(),
        content: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentNotice) {
        await editNotice(currentNotice.id, {
          title: formData.title,
          status: formData.status,
          start_at: format(formData.start_at, 'yyyy-MM-dd HH:mm:ss'),
          end_at: format(formData.end_at, 'yyyy-MM-dd HH:mm:ss'),
          content: formData.content,
        });
      } else {
        await createNotice({
          title: formData.title,
          status: formData.status,
          start_at: format(formData.start_at, 'yyyy-MM-dd HH:mm:ss'),
          end_at: format(formData.end_at, 'yyyy-MM-dd HH:mm:ss'),
          content: formData.content,
        });
      }
      setDialogOpen(false);
      fetchNotices(isEditing ? meta.current_page : 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : `${isEditing ? '更新' : '创建'}公告失败`);
    }
  };

  const isActive = (notice: API.AdminNoticeItem) => {
    const now = new Date();
    const start = new Date(notice.start_at);
    const end = new Date(notice.end_at);
    return notice.status && now >= start && now <= end;
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
          <h1 className="text-3xl font-bold tracking-tight">公告管理</h1>
          <div className="text-sm text-muted-foreground">
            共 {meta.total} 条公告
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            新建公告
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑公告' : '新建公告'}</DialogTitle>
            <DialogDescription>
              {isEditing ? '编辑公告信息，修改标题、状态和生效时间。' : '创建一个新的公告，设置标题、状态和生效时间。'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                标题
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">状态</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <span>{formData.status ? '启用' : '禁用'}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">开始时间</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {format(formData.start_at, 'yyyy-MM-dd')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_at}
                      onSelect={(date) => date && setFormData({ ...formData, start_at: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">结束时间</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {format(formData.end_at, 'yyyy-MM-dd')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.end_at}
                      onSelect={(date) => date && setFormData({ ...formData, end_at: date })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">内容</Label>
              <Textarea
                id="content"
                placeholder="Type your message here."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="col-span-3 h-28"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row">
            <Button className="mt-3 md:mt-0" variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? '确认更新' : '确认创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[180px]">标题</TableHead>
              <TableHead className="min-w-[90px]">状态</TableHead>
              <TableHead className="min-w-[160px]">开始时间</TableHead>
              <TableHead className="min-w-[160px]">结束时间</TableHead>
              <TableHead className="min-w-[160px]">创建时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={`row-${notice.id}`}>
                <TableCell>{notice.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{notice.title}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={isActive(notice) ? "default" : "secondary"}>
                    {isActive(notice) ? '生效中' : '未生效'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(notice.start_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(notice.end_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(notice.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="编辑"
                      onClick={() => handleOpenDialog(notice)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(notice.id)}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
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
