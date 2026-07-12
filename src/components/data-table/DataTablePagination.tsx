import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import * as m from "~/i18n/messages";
import { MEMBERS_PAGE_SIZES } from "~/schema/members";

interface DataTablePaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  selectedCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
  page,
  pageCount,
  pageSize,
  total,
  selectedCount = 0,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p
        className="text-sm text-muted-foreground"
        aria-live="polite"
        data-testid="table-summary"
      >
        {selectedCount > 0
          ? m.tableSelectedCount({ count: selectedCount, total })
          : m.tableTotalCount({ total })}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {m.tableRowsPerPage()}
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value: string | null) => {
              if (value !== null) {
                onPageSizeChange(Number(value));
              }
            }}
          >
            <SelectTrigger size="sm" aria-label={m.tableRowsPerPage()}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEMBERS_PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {m.tablePageOf({ page, pageCount })}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={m.tablePreviousPage()}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={m.tableNextPage()}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
