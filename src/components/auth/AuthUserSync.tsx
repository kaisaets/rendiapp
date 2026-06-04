import { syncAuthenticatedKasutaja } from "@/src/features/kasutajad/api";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";

export function AuthUserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const googleAccount = user.externalAccounts?.find(
      (account) => account.provider === "google",
    );

    const normalizedEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      googleAccount?.emailAddress ||
      "";

    if (!normalizedEmail) {
      console.error(
        "Kasutaja sünkroniseerimine vahele jäetud: email puudub.",
      );
      return;
    }

    void syncAuthenticatedKasutaja({
      clerk_id: user.id,
      email: normalizedEmail,
      nimi: user.fullName || user.username || null,
      google_id: googleAccount?.providerUserId || null,
    }).catch((error) => {
      const errorInfo =
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              status: (error as any).status,
              details: (error as any).details,
            }
          : error;

      console.error("Kasutaja sünkroniseerimine ebaõnnestus:", errorInfo);
    });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
