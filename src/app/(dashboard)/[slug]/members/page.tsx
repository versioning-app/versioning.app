import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MembersService } from '@/services/members.service';
import { get } from '@/services/service-factory';

export default async function Members() {
  const members = await get(MembersService).findAll();

  return (
    <Table>
      <TableCaption>Workspace Members</TableCaption>
      <TableHeader>
        <TableRow className="font-mono">
          <TableHead className="w-[100px]">Member Id</TableHead>
          <TableHead className="w-[100px]">Clerk Id</TableHead>
          <TableHead className="text-right">Created At</TableHead>
          <TableHead className="text-right">Modified At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="font-mono">
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.id}</TableCell>
            <TableCell>{member.clerkId}</TableCell>
            <TableCell className="text-right">
              {member.createdAt.toISOString()}
            </TableCell>
            <TableCell className="text-right">
              {member.modifiedAt.toISOString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
