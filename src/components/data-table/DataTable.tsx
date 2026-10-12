import type {
  ColumnDef,
  Header,
  RowData,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";

import {
  columnSizingFeature,
  FlexRender,
  functionalUpdate,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/utils/cn";

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  columnSizingFeature,
});

export type DataTableFeatures = typeof dataTableFeatures;

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  getRowId: (row: TData) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  /** Shown instead of rows when there are none. */
  emptyState: React.ReactNode;
  /** Dims the table while a new page is fetched, keeping the old rows visible. */
  isPending?: boolean;
  /** Row count for the skeleton shown before the first page arrives. */
  skeletonRows?: number;
  isLoading?: boolean;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  sorting,
  onSortingChange,
  getRowId,
  rowSelection,
  onRowSelectionChange,
  emptyState,
  isPending = false,
  isLoading = false,
  skeletonRows = 10,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    state: { sorting, rowSelection: rowSelection ?? {} },
    manualSorting: true,
    enableRowSelection: onRowSelectionChange !== undefined,
    onSortingChange: (updater) => {
      onSortingChange(functionalUpdate(updater, sorting));
    },
    onRowSelectionChange: (updater) => {
      if (!onRowSelectionChange) {
        return;
      }
      onRowSelectionChange(functionalUpdate(updater, rowSelection ?? {}));
    },
  });

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <TableRoot>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <SortableHeader header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={cn(
            "transition-opacity",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          {isLoading ? (
            <SkeletonRows columns={columns.length} rows={skeletonRows} />
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </TableRoot>
    </div>
  );
}

function SortableHeader<TData extends RowData>({
  header,
}: {
  header: Header<DataTableFeatures, TData>;
}) {
  const content = <FlexRender header={header} />;

  if (!header.column.getCanSort()) {
    return content;
  }

  const direction = header.column.getIsSorted();
  const Icon =
    direction === "asc"
      ? ArrowUp
      : direction === "desc"
        ? ArrowDown
        : ChevronsUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ms-2.5 h-8 gap-1 data-[sorted=true]:text-foreground"
      data-sorted={direction !== false}
      aria-sort={
        direction === "asc"
          ? "ascending"
          : direction === "desc"
            ? "descending"
            : "none"
      }
      onClick={header.column.getToggleSortingHandler()}
    >
      {content}
      <Icon className="size-3.5 opacity-60" aria-hidden />
    </Button>
  );
}

function SkeletonRows({ columns, rows }: { columns: number; rows: number }) {
  return Array.from({ length: rows }, (_row, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from({ length: columns }, (_cell, cellIndex) => (
        <TableCell key={cellIndex}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
