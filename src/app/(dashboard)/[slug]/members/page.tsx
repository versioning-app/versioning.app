import { MembersList } from '@/components/dashboard/lists/members-list';
import { MembersService } from '@/services/members.service';
import { get } from '@/services/service-factory';

export default async function Members() {
  const members = await get(MembersService).findAll();

  if (!members?.length) {
    return (
      <div>
        <p className="text-center text-gray-500">No members found</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <MembersList members={members} />
    </div>
  );
}
