import { useUser } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function AdminLayout() {
  const { user, isLoaded } = useUser();

  // 1. Ootame, kuni Clerki kasutaja andmed on laetud
  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC9D36" />
      </View>
    );
  }

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress === "henrik.saega@voco.ee";

  // 3. Kui ei ole admin, suuna avalehele ("/")
  if (!isAdmin) {
    return <Redirect href="/" />;
  }

  // 4. Kui on admin, luba ligipääs admin alamvaadetele
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
