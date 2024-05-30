import { deleteComponentAction } from '@/actions/components';
import { DataTable } from '@/components/dashboard/data-table';
import * as schema from '@/database/schema';
import { camelToHumanReadable } from '@/lib/utils';
import { MembersService } from '@/services/members.service';
import { get } from '@/services/service-factory';
import { getTableColumns } from 'drizzle-orm';

export default async function Members() {
  const memberColumns = getTableColumns(schema.members);
  const members = await get(MembersService).findAll();

  return (
    <div className="h-full">
      <DataTable
        columns={Object.keys(memberColumns).map((key) => {
          return {
            header: camelToHumanReadable(key),
            accessorKey: key,
          };
        })}
        actions={{ delete: deleteComponentAction }}
        data={members}
      />
    </div>
  );
}
