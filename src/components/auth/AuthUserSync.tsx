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

    void syncAuthenticatedKasutaja({
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      nimi: user.fullName || user.username || null,
      google_id: googleAccount?.providerUserId || null,
    }).catch((error) => {
      console.error("Kasutaja sünkroniseerimine ebaõnnestus:", error);
    });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
