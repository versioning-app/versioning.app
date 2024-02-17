export {};

declare global {
  interface UserPublicMetadata {
    workspaceId: string;
    slug: string;
  }

  interface OrganizationPublicMetadata {
    workspaceId: string;
    slug: string;
  }

  interface CustomJwtSessionClaims {
    org_slug?: string;
    user_slug: string;
    org_workspaceId?: string;
    user_workspaceId: string;
  }
}
