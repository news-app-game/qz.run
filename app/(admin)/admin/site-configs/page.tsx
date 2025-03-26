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
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
// import { DataTablePagination } from "@/components/ui/data-table-pagination";


interface Configs {
  id: number;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// interface PaginationMeta {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
// }

export default function ConfigManagement() {
  const [configs, setConfigs] = useState<Configs[]>([]);
  // const [meta, setMeta] = useState<PaginationMeta>({
  //   current_page: 1,
  //   per_page: 10,
  //   total: 0,
  //   last_page: 1
  // });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<Configs | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const configs = await adminFetch<Configs[]>(`/admin/site-configs`);
      setConfigs(configs || []);
      
      // setMeta(configs.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取配置列表失败');
      setLoading(false);
    }
  };

  // const handlePageChange = (page: number) => {
  //   setLoading(true);
  //   fetchConfigs(page);
  // };

  // const handleDelete = async (id: number) => {
  //   if (!confirm('确定要删除这条配置吗？')) return;
  //
  //   try {
  //     await adminFetch(`/admin/site-configs/${id}`, {
  //       method: 'DELETE',
  //     });
  //     fetchConfigs();
  //   } catch (err) {
  //     alert(err instanceof Error ? err.message : '删除配置失败');
  //   }
  // };

  const handleOpenDialog = (configs?: Configs) => {
    if (configs) {
      setIsEditing(true);
      setCurrentConfig(configs);
      setFormData({
        key: configs.key || '',
        value: configs.value || '',
        description: configs.description || ''
      });
    } else {
      setIsEditing(false);
      setCurrentConfig(null);
      setFormData({
        key: '',
        value: '',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && currentConfig) {
        await adminFetch(`/admin/site-configs/${currentConfig.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            key: formData.key,
            value: formData.value,
            description: formData.description
          }),
        });
      } else {
        await adminFetch('/admin/site-configs', {
          method: 'POST',
          body: JSON.stringify({
            key: formData.key,
            value: formData.value,
            description: formData.description,
          }),
        });
      }
      setDialogOpen(false);
      fetchConfigs();
    } catch (err) {
      alert(err instanceof Error ? err.message : `${isEditing ? '更新' : '创建'}配置失败`);
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
          <h1 className="text-3xl font-bold tracking-tight">系统配置</h1>
          <div className="text-sm text-muted-foreground">
            共 {configs.length} 条配置
          </div>
        </div>
        <div className="flex items-center gap-4">
        <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            新建配置
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑配置' : '新建配置'}</DialogTitle>
            <DialogDescription>
              {isEditing ? '编辑配置信息，修改Key, Value和描述。' : '创建一个新的配置，设置Key, Value和描述。'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Key
              </Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">状态</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.value == 'on'}
                  onCheckedChange={(checked) => setFormData({...formData, value: checked ? 'on' : 'off'})}
                />
                <span>{formData.value === 'on' ? '启用' : '禁用'}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">描述</Label>
              <Textarea
                id="description"
                placeholder="系统配置的描述信息."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <TableHead className="min-w-[90px]">Key</TableHead>
              <TableHead className="min-w-[90px]">Value</TableHead>
              <TableHead className="min-w-[180px]">描述</TableHead>
              <TableHead className="min-w-[160px]">创建时间</TableHead>
              <TableHead className="min-w-[160px]">上次更新</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={`row-${config.id}`}>
                <TableCell>{config.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{config.key}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{config.value}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{config.description}</span>
                </TableCell>
                <TableCell>
                  {new Date(config.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(config.updated_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="编辑"
                      onClick={() => handleOpenDialog(config)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {/*<Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(config.id)}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>*/}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/*<DataTablePagination
        currentPage={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={handlePageChange}
      />*/}
    </div>
  );
}
