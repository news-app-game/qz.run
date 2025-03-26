'use client';

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { adminFetch } from '../utils/fetch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
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
import Image from "next/image";

// import { DataTablePagination } from "@/components/ui/data-table-pagination";


interface Location {
  id: number;
  name: string;
  flag_url: string;
  created_at: string;
  updated_at: string;
}

// interface PaginationMeta {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
// }

export default function LocationManagement() {
  const [locations, setLocations] = useState<Location[]>([]);
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
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  
  useEffect(() => {
    fetchLocations();
  }, []);
  
  const fetchLocations = async () => {
    try {
      const locations = await adminFetch<Location[]>(`/admin/nodes-loc`);
      setLocations(locations || []);
      
      // setMeta(locations.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取区域列表失败');
      setLoading(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // 限制最多上传5张图片
      if (images.length + newFiles.length > 1) {
        alert('最多只能上传1张图片');
        return;
      }
      
      setImages(prev => [...prev, ...newFiles]);
      
      // 创建预览URL
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  // const handlePageChange = (page: number) => {
  //   setLoading(true);
  //   fetchLocations(page);
  // };
  //
  // const handleDelete = async (id: number) => {
  //   if (!confirm('确定要删除这条区域吗？')) return;
  //
  //   try {
  //     await adminFetch(`/admin/nodes-loc/${id}`, {
  //       method: 'DELETE',
  //     });
  //     fetchLocations();
  //   } catch (err) {
  //     alert(err instanceof Error ? err.message : '删除区域失败');
  //   }
  // };
  
  const handleOpenDialog = (location?: Location) => {
    setImages([])
    setPreviewUrls([])
    if (location) {
      setIsEditing(true);
      setCurrentLocation(location);
      setFormData({
        name: location.name || ''
      });
    } else {
      setIsEditing(false);
      setCurrentLocation(null);
      setFormData({
        name: '',
      });
    }
    setDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    try {
      // 创建FormData对象用于上传文件
      const sumitFormData = new FormData();
      sumitFormData.append('name', formData.name);
      // 添加图片
      images.forEach(image => {
        sumitFormData.append('flag', image);
      });
      if (isEditing && currentLocation) {
        await adminFetch(`/admin/nodes-loc/${currentLocation.id}`, {
          method: 'PUT',
          body: sumitFormData,
        });
      } else {
        await adminFetch('/admin/nodes-loc', {
          method: 'POST',
          body: sumitFormData,
        });
      }
      setDialogOpen(false);
      fetchLocations();
    } catch (err) {
      alert(err instanceof Error ? err.message : `${isEditing ? '更新' : '创建'}区域失败`);
    }
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // 释放预览URL
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold tracking-tight">区域管理</h1>
          <div className="text-sm text-muted-foreground">
            共 {locations.length} 条区域
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2"/>
            新建区域
          </Button>
        </div>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑区域' : '新建区域'}</DialogTitle>
            <DialogDescription>
              {isEditing ? '编辑区域信息，修改国家和国旗。' : '创建一个新的区域，设置国家和国旗。'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="title" className="text-right justify-start w-16">
                国家
              </Label>
              <div className="w-full">
                <Input
                  id="key"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-1 gap-4 flex justify-start items-center">
              <Label htmlFor="title" className="text-right w-16">
                国旗
              </Label>
              <div className="w-full flex items-center">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6]"
                >
                  选择图片
                </Button>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="ml-2 text-sm text-gray-500 block">
                  {images.length > 0 ? `已选择 ${images.length} 张图片` : '未选择任何图片'}
                  </span>
              </div>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 ml-6">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`预览图 ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-20 w-auto object-cover rounded border border-gray-200"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              <TableHead className="min-w-[60px]">国旗</TableHead>
              <TableHead className="min-w-[90px]">国家</TableHead>
              <TableHead className="min-w-[160px]">创建时间</TableHead>
              <TableHead className="min-w-[160px]">上次更新</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={`row-${location.id}`}>
                <TableCell>{location.id}</TableCell>
                <TableCell>
                  <img className="w-9" src={location.flag_url} alt={location.name}/>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{location.name}</span>
                </TableCell>
                <TableCell>
                  {new Date(location.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(location.updated_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="编辑"
                      onClick={() => handleOpenDialog(location)}
                    >
                      <Pencil className="h-4 w-4"/>
                    </Button>
                    {/*<Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(location.id)}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4 text-red-500"/>
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
