import { AdminMetadataLauncher } from "@/src/components/admin/metadata/AdminMetadataLauncher";
import { applyGlobalTypography } from "@/src/theme/typography";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

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

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {isAdminRoute ? <AdminMetadataLauncher /> : null}
    </>
  );
}
