import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DataTablePaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  showJumpInput?: boolean;
}

export function DataTablePagination({
  currentPage,
  lastPage,
  onPageChange,
  showJumpInput = true,
}: DataTablePaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>('');

  const handleJumpPage = () => {
    const value = parseInt(jumpPage);
    if (value >= 1 && value <= lastPage) {
      onPageChange(value);
      setJumpPage(''); // 跳转后清空输入
    }
  };

  return (
    <Pagination className=" justify-end">
      <PaginationContent className="flex flex-col md:flex-row">
        <div className="flex flex-row">
          {currentPage > 1 && (
            <PaginationItem key="prev">
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className="cursor-pointer"
                size="sm"
              />
            </PaginationItem>
          )}

          {Array.from({ length: lastPage }, (_, i) => i + 1)
            .filter(page => {
              const nearCurrent = Math.abs(page - currentPage) <= 1;
              const isFirstOrLast = page === 1 || page === lastPage;
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
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    size="sm"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );

              return items;
            }).flat()}

          {currentPage < lastPage && (
            <PaginationItem key="next">
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className="cursor-pointer"
                size="sm"
              />
            </PaginationItem>
          )}

          <span className="text-sm text-muted-foreground flex items-center">
            共 {lastPage} 页
          </span>
        </div>
        <div className="mt-3 sm:mt-0">
          {showJumpInput && lastPage > 5 && (
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">跳转到</span>
                <input
                  type="number"
                  min={1}
                  max={lastPage}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  className="w-16 h-8 rounded-md border px-2 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleJumpPage();
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">页</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleJumpPage}
                  className="h-8"
                >
                  跳转
                </Button>
              </div>
            </div>
          )}
        </div>
      </PaginationContent>
    </Pagination>
  );
}
