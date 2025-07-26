import { MembersList } from '@/components/dashboard/lists/members-list';
import { MembersService } from '@/services/members.service';
import { get } from '@/services/service-factory';

export default async function Members() {
  const membersService = await get(MembersService);
  const members = await membersService.findAll();

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
