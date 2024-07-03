export const DATE_OMITTED_FIELDS: {
  createdAt: true;
  modifiedAt: true;
} = {
  createdAt: true,
  modifiedAt: true,
};

export const DEFAULT_OMITTED_FIELDS: {
  id: true;
} & typeof DATE_OMITTED_FIELDS = {
  id: true,
  ...DATE_OMITTED_FIELDS,
};

export const DEFAULT_WORKSPACE_OMITTED_FIELDS: {
  workspaceId: true;
} & typeof DEFAULT_OMITTED_FIELDS = {
  workspaceId: true,
  ...DEFAULT_OMITTED_FIELDS,
};
