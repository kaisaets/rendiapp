import { useAuth, useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GoogleSignInButton from "../../src/components/GoogleSignInButton";

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();
  const [viga, setViga] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (isSignedIn) {
      return;
    }

    setViga(null);
    try {
      const redirectUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/sign-in`
          : AuthSession.makeRedirectUri();
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Google login viga:", err);
      setViga("Sisselogimine ebaõnnestus. Proovi uuesti.");
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/Hero.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.contentCard}>
          <Text style={styles.title}>Tere tulemast!</Text>
          <Text style={styles.subtitle}>Logi sisse, et jätkata</Text>

          <GoogleSignInButton onPress={handleGoogleSignIn} />

          {viga && <Text style={styles.veaTekst}>{viga}</Text>}
        </View>
        <Text style={styles.clerkInfo}>Kasutab Clerk logimisteenust.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 24,
    bottom: 40,
  },
  contentCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 4,
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#f5f5f5",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#b5b5b5",
    marginBottom: 20,
    textAlign: "center",
  },
  veaTekst: {
    color: "#c62828",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  clerkInfo: {
    marginTop: 12,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
});
