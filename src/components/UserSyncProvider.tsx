"use client";

import { useUserSync } from "@/hooks/useUserSync";

export const UserSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // This hook will automatically sync user with database when they authenticate
  useUserSync();

  return <>{children}</>;
};
