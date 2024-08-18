'use client';
import {
  DataTable,
  DataTableCellRenderer,
  DataTableColumnHeader,
} from '@/components/dashboard/data-table';
import { camelToHumanReadable } from '@/lib/utils';

export const DataList = ({ data }: { data: any }) => {
  if (!data || data.length === 0) {
    return <div>No data</div>;
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
