'use client';
import { useUser } from '@clerk/nextjs';

export function UserReload({ children }: { children?: React.ReactNode }) {
  const { user } = useUser();

  if (user) {
    user.reload();
  }

  if (!children) {
    return <></>;
  }
  return <>{children}</>;
}
