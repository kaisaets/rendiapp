import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function SsoCallbackScreen() {
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      try {
        await clerk.handleRedirectCallback({}, async (to) => {
          if (!isMounted) {
            return;
          }

          router.replace((to || "/") as any);
        });
      } catch (error) {
        console.error("SSO callback ebaõnnestus:", error);
        if (isMounted) {
          router.replace("/sign-in" as any);
        }
      }
    }

    void handleCallback();

    return () => {
      isMounted = false;
    };
  }, [clerk, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#CC9D36" />
      <Text style={styles.text}>Sisselogimine käib...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  text: {
    color: "#E8E8E8",
    fontSize: 14,
  },
});
