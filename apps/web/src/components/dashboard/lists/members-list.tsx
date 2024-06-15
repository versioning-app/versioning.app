'use client';
import { deleteComponentAction } from '@/actions/components';
import {
  DataTable,
  DataTableCellRenderer,
  DataTableColumnHeader,
} from '@/components/dashboard/data-table';
import { camelToHumanReadable } from '@/lib/utils';

export const MembersList = ({ members }: { members: any }) => {
  return (
    <DataTable
      columns={Object.keys(members[0]).map((key) => {
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
      actions={{ delete: deleteComponentAction }}
      data={members}
    />
  );
};
