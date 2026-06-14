import { useUser } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AdminLayout() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC9D36" />
      </View>
    );
  }

  const SUPER_ADMIN_EMAIL = process.env.EXPO_PUBLIC_SUPER_ADMIN_EMAIL;

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;

  const isAdmin =
    email &&
    SUPER_ADMIN_EMAIL &&
    email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

    console.log("EMAIL:", email);
    console.log("ENV:", SUPER_ADMIN_EMAIL);
    console.log("ISADMIN CHECK:", isAdmin);
  if (!isAdmin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
});
