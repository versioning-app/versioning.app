import {
  PermissionAction,
  PermissionScope,
  Permissions,
} from '@/database/schema';
import { PERMISSION_VERSIONS } from '@/permissions/config';

export type Role = {
  name: string;
  defaults?: { member?: boolean; creator?: boolean; api?: boolean };
  permissions: RolePermission[];
  meta: Meta;
};

type Meta = {
  createdIn: PERMISSION_VERSIONS;
  deprecatedIn?: PERMISSION_VERSIONS;
};

export type RolePermission = {
  resource: string[];
  isPattern: boolean;
  action: PermissionAction;
  type: Permissions;
  scope: PermissionScope;
  meta: Meta;
};

export const Admin: Role = {
  name: '[SYSTEM] Super Admin Role',
  defaults: {
    creator: true,
  },
  meta: {
    createdIn: 1,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'manage',
      type: 'db',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
    {
      resource: ['*'],
      isPattern: true,
      action: 'execute',
      type: 'action',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
  ],
};

export const ReleaseManager: Role = {
  name: '[SYSTEM] Release Manager Role',
  meta: {
    createdIn: 1,
  },
  permissions: [
    {
      resource: ['release*'],
      isPattern: true,
      action: 'manage',
      type: 'db',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
    {
      resource: ['release:*'],
      isPattern: true,
      action: 'execute',
      type: 'action',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
  ],
};

export const ReadOnlyRole: Role = {
  name: '[SYSTEM] Read Only Role',
  meta: {
    createdIn: 1,
  },
  defaults: {
    member: true,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'read',
      type: 'db',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
  ],
};

export const ApiRole: Role = {
  name: '[SYSTEM] Api Role',
  defaults: { api: true },
  meta: {
    createdIn: 1,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'manage',
      type: 'api',
      scope: 'workspace',
      meta: {
        createdIn: 1,
      },
    },
  ],
};

export const SystemRoles: Role[] = [
  Admin,
  ReleaseManager,
  ReadOnlyRole,
  ApiRole,
];
