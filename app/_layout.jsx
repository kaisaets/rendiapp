import { AdminMetadataLauncher } from "@/src/components/admin/metadata/AdminMetadataLauncher";
import { AuthUserSync } from "@/src/components/auth/AuthUserSync";
import { applyGlobalTypography } from "@/src/theme/typography";
import { ClerkLoaded, ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/pages/admin");

  const [fontsLoaded] = useFonts({
    QuicksandRegular: require("../assets/fonts/Quicksand-Regular.ttf"),
    QuicksandMedium: require("../assets/fonts/Quicksand-Medium.ttf"),
    QuicksandSemiBold: require("../assets/fonts/Quicksand-SemiBold.ttf"),
    QuicksandBold: require("../assets/fonts/Quicksand-Bold.ttf"),
    QuicksandLight: require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      applyGlobalTypography();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!publishableKey) {
    return (
      <View style={styles.errorWrap}>
        <Text style={styles.errorTitle}>Clerk key puudub</Text>
        <Text style={styles.errorText}>
          Lisa .env faili EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ja taaskäivita
          Docker.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Stack screenOptions={{ headerShown: false }} />
        <AuthUserSync />
        {isAdminRoute ? <AdminMetadataLauncher /> : null}
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  errorWrap: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    color: "#F5D79B",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  errorText: {
    color: "#E2D4B7",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
