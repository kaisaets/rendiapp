import { useAuth } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Anna Clerkile aega sessioon töödelda
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text>Logimine...</Text>
      </View>
    );
  }

  if (isSignedIn) return <Redirect href="/(home)" />;

  return <Redirect href="/(auth)/sign-in" />;
}
