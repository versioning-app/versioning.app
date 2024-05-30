'use client';

import {
  ColumnDef,
  Row,
  SortDirection,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import { HTMLAttributes, forwardRef, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn('w-full caption-bottom text-sm', className)}
    {...props}
  />
));
TableComponent.displayName = 'TableComponent';

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
  function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
    // @ts-expect-error data-index is a valid attribute
    const index = props['data-index'];
    const row = rows[index];

    if (!row) return null;

    return (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        {...props}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  };

function SortingIndicator({ isSorted }: { isSorted: SortDirection | false }) {
  if (!isSorted) return null;
  return (
    <div>
      {
        {
          asc: '↑',
          desc: '↓',
        }[isSorted]
      }
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  height?: string;

  actions?: {
    delete: (deleteArgs: { id: string }) => Promise<{ serverError?: string }>;
  };
}

const actionsColumn = ({
  actions,
}: {
  actions: {
    delete: (deleteArgs: { id: string }) => Promise<{ serverError?: string }>;
  };
}) => ({
  id: 'actions',
  enableHiding: false,
  size: 60,
  cell: ({ row }: any) => {
    const resource = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => actions.delete({ id: resource.id as string })}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

export function DataTable<TData, TValue>({
  columns,
  data,
  height,
  actions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  if (actions?.delete && !columns.find((c) => c.id === 'actions')) {
    columns.push({ ...actionsColumn({ actions }) });
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // const { rows } = table.getRowModel();
  const { rows } = table.getCoreRowModel();

  return (
    <div className="rounded-md border h-full mb-20">
      <TableVirtuoso
        style={{ height: height ?? '100%' }}
        totalCount={rows.length}
        components={{
          Table: TableComponent,
          TableRow: TableRowComponent(rows),
        }}
        fixedHeaderContent={() =>
          table.getHeaderGroups().map((headerGroup) => (
            // Change header background color to non-transparent
            <TableRow className="bg-card hover:bg-muted" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex items-center"
                        {...{
                          style: header.column.getCanSort()
                            ? {
                                cursor: 'pointer',
                                userSelect: 'none',
                              }
                            : {},
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <SortingIndicator
                          isSorted={header.column.getIsSorted()}
                        />
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))
        }
      />
    </div>
  );
}
