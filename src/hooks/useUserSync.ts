import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const useUserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Only run when user is loaded and authenticated
    if (isLoaded && user) {
      // Call the sync API to ensure user exists in database
      fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Error syncing user:", error);
        // Don't show error to user, just log it
      });
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
};
