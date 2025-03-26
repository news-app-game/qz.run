'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import { adminFetch } from '../utils/fetch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { zhCN } from "date-fns/locale";
import { DataTablePagination } from "@/components/ui/data-table-pagination";


interface PlatformType {
  osType?: string;
  arch?: string;
  osVersion?: string;
  clientVersion?: string;
}

interface OnlineDevice {
  arch: string,
  hostname: string,
  last_login: string,
  clientVersion: string,
  osType: string,
  osVersion: string
}

interface User {
  id: number;
  email: string;
  invite_code: string | null;
  created_at: string;
  admin_role: number;
  admin_role_name: string | null;
  traffic_used_detail: string | null;
  online_devices: OnlineDevice[] | null;
  online: number;
  member_expired_at: string | null;
  platform_type: PlatformType | null;
  register_source_detail: string | null;
  online_total_minutes: number | null;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  users: User[];
  meta: PaginationMeta;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  });
  const [idSearch, setIdSearch] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [onlineFilter, setOnlineFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDevicesDialog, setShowDevicesDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("1");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [emailSearch, setEmailSearch] = useState<string>("");
  const [showExpireDialog, setShowExpireDialog] = useState(false);
  const [newExpireDate, setNewExpireDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>("00");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");

  useEffect(() => {
    fetchUsers(meta.current_page);
  }, [roleFilter, onlineFilter, sortBy, sortOrder, emailSearch, idSearch]);

  const fetchUsers = async (page: number) => {
    try {
      const roleQuery = (roleFilter !== 'all' && roleFilter !== '') ? `&role=${roleFilter}` : '';
      const onlineQuery = (onlineFilter !== 'all' && onlineFilter !== '') ? (onlineFilter === 'online' ? `&online=1` : '&online=0') : '';
      const sortQuery = sortBy ? `&sort_by=${sortBy}&sort_order=${sortOrder}` : '';
      const searchQuery = emailSearch ? `&email=${encodeURIComponent(emailSearch)}` : '';
      const idQuery = (idSearch !== null) ? `&user_id=${idSearch}` : '';
      const response = await adminFetch<ApiResponse>(
        `/admin/users?page=${page}&per_page=${meta.per_page}${idQuery}${roleQuery}${sortQuery}${searchQuery}${onlineQuery}`
      );
      setUsers(response.users || []);
      setMeta(response.meta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '获取用户列表失败');
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchUsers(page);
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;

    try {
      await adminFetch(`/admin/users/${selectedUser.id}/role`, {
        method: 'PUT',
        body: JSON.stringify({
          role: newRole
        }),
      });
      setShowRoleDialog(false);
      fetchUsers(meta.current_page);
    } catch (err) {
      alert(err instanceof Error ? err.message : '修改权限失败');
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.admin_role.toString());
    setShowRoleDialog(true);
  };

  const handleExpireChange = async () => {
    if (!selectedUser || !newExpireDate) return;

    try {
      const dateWithTime = new Date(newExpireDate);
      dateWithTime.setHours(parseInt(selectedHour));
      dateWithTime.setMinutes(parseInt(selectedMinute));

      await adminFetch(`/admin/users/${selectedUser.id}/expire`, {
        method: 'PUT',
        body: JSON.stringify({
          expire_at: format(dateWithTime, "yyyy-MM-dd'T'HH:mm:ss")
        }),
      });
      setShowExpireDialog(false);
      fetchUsers(meta.current_page);
    } catch (err) {
      alert(err instanceof Error ? err.message : '修改到期时间失败');
    }
  };

  const openExpireDialog = (user: User) => {
    setSelectedUser(user);
    const expireDate = user.member_expired_at ? new Date(user.member_expired_at) : new Date();
    setNewExpireDate(expireDate);
    setSelectedHour(format(expireDate, 'HH'));
    setSelectedMinute(format(expireDate, 'mm'));
    setShowExpireDialog(true);
  };

  const openDevicesDialog = (user: User) => {
    setSelectedUser(user);
    setShowDevicesDialog(true);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setMeta(prev => ({ ...prev, current_page: 1 }));
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
          <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          <div className="text-sm text-muted-foreground text-center md:text-left">
            共 {meta.total} 个用户
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 md:mt-0">
          <input
            type="number"
            placeholder="搜索用户ID..."
            value={idSearch || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              setIdSearch(value);
              setMeta(prev => ({ ...prev, current_page: 1 }));
            }}
            className="px-3 py-2 border rounded-md w-full md:w-auto"
          />
          <input
            type="text"
            placeholder="搜索邮箱..."
            value={emailSearch}
            onChange={(e) => {
              setEmailSearch(e.target.value);
              setMeta(prev => ({ ...prev, current_page: 1 }));
            }}
            className="px-3 py-2 border rounded-md w-full md:w-auto"
          />
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setMeta(prev => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="admin">管理员</SelectItem>
              <SelectItem value="user">普通用户</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={onlineFilter}
            onValueChange={(value) => {
              setOnlineFilter(value);
              setMeta(prev => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择在线状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="online">在线</SelectItem>
              <SelectItem value="offline">离线</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 min-w-[100px]"
                onClick={() => handleSort("traffic_used")}
              >
                <div className="flex items-center">
                  流量使用
                  {sortBy === "traffic_used" && (
                    <span className="ml-2 text-base font-bold">
                      {sortOrder === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="min-w-[80px]">在线状态</TableHead>
              <TableHead className="min-w-[60px]">来源</TableHead>
              <TableHead className="min-w-[140px]">客户端信息</TableHead>
              <TableHead>邀请码</TableHead>
              <TableHead className="min-w-[100px]">角色</TableHead>
              <TableHead className="min-w-[160px]">会员到期时间</TableHead>
              <TableHead className="min-w-[160px]">累计在线(分钟)</TableHead>
              <TableHead className="min-w-[160px]">注册时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.traffic_used_detail || '-'}</TableCell>
                <TableCell>
                  {
                    user.online > 0
                      ? (
                        <Badge onClick={() => openDevicesDialog(user)} className="cursor-pointer w-[70px] text-center" variant="destructive">
                          <span className="w-full">在线({user.online_devices?.length || 0})</span>
                        </Badge>
                      )
                      : (
                        <Badge className="w-[70px] text-center" variant="default">
                          <span className="w-full">离线</span>
                        </Badge>
                      )
                  }
                </TableCell>
                <TableCell>{user.register_source_detail || '-'}</TableCell>
                <TableCell>{user.platform_type?.osType || '-'} {user.platform_type?.arch || '-'} {user.platform_type?.osVersion || '-'} {user.platform_type?.clientVersion || '-'}</TableCell>
                <TableCell>{user.invite_code || '-'}</TableCell>
                <TableCell>
                  <Badge variant={user.admin_role ? "destructive" : "default"}>
                    {user.admin_role ? '管理员' : '普通用户'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => openExpireDialog(user)}>{user.member_expired_at ? new Date(user.member_expired_at).toLocaleString() : '-'}</span>

                  </div>
                </TableCell>
                <TableCell>{user.online_total_minutes || '-'}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => openRoleDialog(user)}
                    >
                      权限
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

      <Dialog open={showDevicesDialog} onOpenChange={setShowDevicesDialog}>
        <DialogContent className="max-w-auto sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>在线设备列表</DialogTitle>
            <DialogDescription>
              查看用户 {selectedUser?.email} 的在线设备列表
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 w-full overflow-x-hidden">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">上次登录</TableHead>
                    <TableHead className="min-w-[90px]">客户端版本</TableHead>
                    <TableHead className="min-w-[60px]">系统类型</TableHead>
                    <TableHead className="min-w-[70px]">系统版本</TableHead>
                    <TableHead className="min-w-[160px]">Host Name</TableHead>
                    <TableHead className="min-w-[80px]">系统架构</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUser?.online_devices?.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell>{device.last_login ? new Date(device.last_login).toLocaleString() : '-'}</TableCell>
                      <TableCell>{device.clientVersion}</TableCell>
                      <TableCell>{device.osType}</TableCell>
                      <TableCell>{device.osVersion}</TableCell>
                      <TableCell>{device.hostname}</TableCell>
                      <TableCell>{device.arch}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row">
            <Button className="mt-3 md:mt-0" variant="outline" onClick={() => setShowDevicesDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改用户权限</DialogTitle>
            <DialogDescription>
              修改用户 {selectedUser?.email} 的权限
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={newRole}
              onValueChange={setNewRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">管理员</SelectItem>
                <SelectItem value="0">普通用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row">
            <Button className="mt-3 md:mt-0" variant="outline" onClick={() => setShowRoleDialog(false)}>
              取消
            </Button>
            <Button onClick={handleRoleChange}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExpireDialog} onOpenChange={setShowExpireDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改到期时间</DialogTitle>
            <DialogDescription>
              修改用户 {selectedUser?.email} 的会员到期时间
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Calendar
              mode="single"
              selected={newExpireDate}
              onSelect={setNewExpireDate}
              locale={zhCN}
              className="rounded-md border"
            />
            <div className="flex items-center gap-2">
              <Select
                value={selectedHour}
                onValueChange={setSelectedHour}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="时" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}时
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select
                value={selectedMinute}
                onValueChange={setSelectedMinute}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="分" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }).map((_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row">
            <Button className="mt-3 md:mt-0" variant="outline" onClick={() => setShowExpireDialog(false)}>
              取消
            </Button>
            <Button onClick={handleExpireChange}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
