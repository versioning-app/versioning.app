export {};

declare global {
  interface UserPublicMetadata {
    workspaceId: string;
  }

  interface OrganizationPublicMetadata {
    workspaceId: string;
  }

  interface CustomJwtSessionClaims {
    org_workspaceId?: string;
    user_workspaceId: string;
  }
}
