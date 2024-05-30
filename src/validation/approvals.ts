import { approval_groups } from '@/database/schema';
import { DEFAULT_OMITTED_FIELDS } from '@/validation/defaults';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const insertApprovalGroups = createInsertSchema(approval_groups);
const selectApprovalGroups = createSelectSchema(approval_groups);

export const createApprovalGroupSchema = insertApprovalGroups.omit(
  DEFAULT_OMITTED_FIELDS,
);

export const deleteApprovalGroupSchema = selectApprovalGroups.pick({
  id: true,
});
