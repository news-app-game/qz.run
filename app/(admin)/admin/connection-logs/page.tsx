"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { adminFetch } from "../utils/fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  user_id: number;
  system: string;
  user_ip: string;
  client_version: string;
  access_domain: string;
  preferred_ip: string;
  message: string;
  created_at: string;
  connect_type: string;
  connect_result: string;
  business_type: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface ApiResponse {
  connection_logs: Version[];
  meta: PaginationMeta;
  connect_type_list: string[];
  connect_result_list: string[];
  business_type_list: string[];
}

export default function VersionManagement() {
  const [logs, setLogs] = useState<Version[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idSearch, setIdSearch] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [resultFilter, setResultFilter] = useState<string>("");
  const [businessFilter, setBusinessFilter] = useState<string>("");
  const [domainSearch, setDomainSearch] = useState<string>("");
  const [typeList, setTypeList] = useState<{ [key: number]: string }>({});
  const [resultList, setResultList] = useState<{ [key: number]: string }>({});
  const [businessList, setBusinessList] = useState<{ [key: number]: string }>(
    {}
  );
  useEffect(() => {
    fetchLogs(meta.current_page);
  }, [idSearch, typeFilter, resultFilter, businessFilter, domainSearch]);

  const fetchLogs = async (page: number) => {
    try {
      const idQuery = (idSearch !== null) ? `&user_id=${idSearch}` : '';
      const typeQuery = (typeFilter !== '0' && typeFilter !== '') ? `&connection_type=${typeFilter}` : '';
      const resultQuery = (resultFilter !== '0' && resultFilter !== '') ? `&connection_result=${resultFilter}` : '';
      const businessQuery = (businessFilter !== '0' && businessFilter !== '') ? `&business_type=${businessFilter}` : '';
      const domainQuery = (domainSearch !== '') ? `&access_domain=${encodeURIComponent(domainSearch)}` : '';
      const response = await adminFetch<ApiResponse>(
        `/admin/connection-logs?page=${page}&per_page=${meta.per_page}${idQuery}${typeQuery}${resultQuery}${businessQuery}${domainQuery}`
      );
      console.log(response);

      setLogs(response?.connection_logs || []);
      setMeta(response.meta);
      setTypeList(response?.connect_type_list || {});
      setResultList(response?.connect_result_list || {});
      setBusinessList(response?.business_type_list || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "获取连接日志失败");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchLogs(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        加载中...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">连接日志</h1>
          <div className="text-sm text-muted-foreground">
            共 {meta.total} 条记录
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="搜索用户ID..."
            value={idSearch || ""}
            onChange={(e) => {
              setIdSearch(Number(e.target.value));
              setMeta((prev) => ({ ...prev, current_page: 1 }));
            }}
            className="px-3 py-2 border rounded-md w-full md:w-auto"
          />
          <input
            type="text"
            placeholder="搜索域名..."
            value={domainSearch}
            onChange={(e) => {
              setDomainSearch(e.target.value);
              setMeta((prev) => ({ ...prev, current_page: 1 }));
            }}
            className="px-3 py-2 border rounded-md w-full md:w-auto"
          />
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setMeta((prev) => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择连接类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">全部</SelectItem>
              {Object.keys(typeList).map((type) => (
                <SelectItem key={type} value={type}>
                  {typeList[Number(type)]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={resultFilter}
            onValueChange={(value) => {
              setResultFilter(value);
              setMeta((prev) => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择连接结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">全部</SelectItem>
              {Object.keys(resultList).map((result) => (
                <SelectItem key={result} value={result}>
                  {resultList[Number(result)]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={businessFilter}
            onValueChange={(value) => {
              setBusinessFilter(value);
              setMeta((prev) => ({ ...prev, current_page: 1 }));
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="选择业务类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">全部</SelectItem>
              {Object.keys(businessList).map((business) => (
                <SelectItem key={business} value={business}>
                  {businessList[Number(business)]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="min-w-[60px]">用户ID</TableHead>
              <TableHead className="min-w-[60px]">系统</TableHead>
              <TableHead className="min-w-[60px]">版本</TableHead>
              <TableHead className="min-w-[60px]">用户IP</TableHead>
              <TableHead className="min-w-[60px]">连接类型</TableHead>
              <TableHead className="min-w-[60px]">连接结果</TableHead>
              <TableHead className="min-w-[60px]">业务类型</TableHead>
              <TableHead className="min-w-[60px]">域名</TableHead>
              <TableHead className="min-w-[60px]">首选 IP</TableHead>
              <TableHead className="min-w-[60px]">信息</TableHead>
              <TableHead className="min-w-[60px]">时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={`row-${log.id}`}>
                <TableCell>{log.id}</TableCell>
                <TableCell>
                  <span className="font-medium">{log.user_id}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log.system}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.client_version}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.user_ip}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.connect_type}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.connect_result}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.business_type}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.access_domain}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.preferred_ip}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{log?.message}</span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
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
            .filter((page) => {
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
            })
            .flat()}

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
