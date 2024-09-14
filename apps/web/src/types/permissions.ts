import { PermissionAction, Permissions } from '@/database/schema';
import { Database, Globe, Zap } from 'lucide-react';

export type EvaluatePermissionFunction = (
  resource: string,
  actions: PermissionAction[],
  types: Permissions[],
  roleIds: string[],
) => Promise<boolean>;

export type FetchRolesFunction = () => Promise<{ id: string; name: string }[]>;

export type FetchAvailableResourcesFunction = () => Promise<{
  tables: string[];
}>;

export type PermissionEntry = {
  id: string;
  resource: string;
  customResource: string;
  actions: PermissionAction[];
  type: Permissions | null;
  isCollapsed: boolean;
};

export const ACTIONS: PermissionAction[] = [
  'read',
  'create',
  'update',
  'delete',
  'manage',
  'execute',
];

export const TYPES: Permissions[] = ['db', 'api', 'action'];

export const TYPE_MAP: Record<
  Permissions,
  { label: string; icon: React.ElementType }
> = {
  db: { label: 'Database', icon: Database },
  api: { label: 'API', icon: Globe },
  action: { label: 'Action', icon: Zap },
};
