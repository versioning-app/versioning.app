export const Admin = {
  name: 'Admin Role',
  defaults: {
    creator: true,
    member: false,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'manage',
      type: 'db',
      scope: 'workspace',
    },
    {
      resource: ['*'],
      isPattern: true,
      action: 'manage',
      type: 'action',
    },
  ],
  version: 1,
};

export const Member = {
  name: 'Member Role',
  defaults: {
    creator: false,
    member: true,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'read',
      type: 'db',
      scope: 'workspace',
    },
    {
      resource: ['*'],
      isPattern: true,
      action: 'create',
      type: 'db',
      scope: 'self',
    },
    {
      resource: ['*'],
      isPattern: true,
      action: 'update',
      type: 'db',
      scope: 'self',
    },
    {
      resource: ['*'],
      isPattern: true,
      action: 'delete',
      type: 'db',
      scope: 'self',
    },
  ],
  version: 1,
};

export const ApiRole = {
  name: 'Api',
  defaults: {
    creator: false,
    member: false,
  },
  permissions: [
    {
      resource: ['*'],
      isPattern: true,
      action: 'manage',
      type: 'api',
    },
  ],
  version: 1,
};
