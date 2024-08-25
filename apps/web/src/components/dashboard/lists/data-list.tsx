'use client';
import {
  DataTable,
  DataTableCellRenderer,
  DataTableColumnHeader,
} from '@/components/dashboard/data-table';
import { camelToHumanReadable } from '@/lib/utils';

export const DataList = ({ data }: { data: any }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-accent p-3 rounded-xl">
        <p className="text-xl">No results found</p>
        <p>We could not find any results</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={Object.keys(data[0]).map((key) => {
        return {
          header: ({ column }: any) => (
            <DataTableColumnHeader
              column={column}
              title={camelToHumanReadable(key)}
            />
          ),
          accessorKey: key,
          cell: DataTableCellRenderer,
        };
      })}
      data={data}
    />
  );
};
