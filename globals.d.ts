export {};

declare global {
  interface UserPublicMetadata {
    workspaceId: string;
  }

  interface OrganizationPublicMetadata {
    workspaceId: string;
  }

  interface CustomJwtSessionClaims {
    user_meta?: {
      workspaceId: string;
    };
    org_meta?: {
      workspaceId: string;
    };
  }
}
