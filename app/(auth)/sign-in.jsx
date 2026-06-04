import { useAuth, useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { Redirect, useRouter } from "expo-router";
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
  const router = useRouter();
  const [viga, setViga] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGoogleSignIn = async () => {
    if (isSignedIn || isSubmitting) {
      return;
    }

    setViga(null);
    setIsSubmitting(true);
    try {
      const redirectUrl =
        Platform.OS === "web"
          ? `${window.location.origin}/sign-in`
          : AuthSession.makeRedirectUri({
              scheme: "rendiapp",
              path: "oauth-native-callback",
            });
      const { createdSessionId, signIn, signUp, setActive } =
        await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });
      const nextSessionId =
        createdSessionId || signIn?.createdSessionId || signUp?.createdSessionId;

      if (nextSessionId) {
        await setActive({ session: nextSessionId });
        if (Platform.OS !== "web") {
          await WebBrowser.dismissBrowser();
        }
        router.replace("/");
      } else {
        setViga(
          "Sisselogimine jäi pooleli. Sulge avanenud brauser ja proovi uuesti.",
        );
      }
    } catch (err) {
      console.error("Google login viga:", err);
      setViga("Sisselogimine ebaõnnestus. Proovi uuesti.");
    } finally {
      setIsSubmitting(false);
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

          <GoogleSignInButton
            onPress={handleGoogleSignIn}
            disabled={isSubmitting}
          />

          {isSubmitting ? (
            <Text style={styles.infoTekst}>Sisselogimine käib...</Text>
          ) : null}

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
  infoTekst: {
    color: "#D6C39B",
    fontSize: 13,
    marginTop: 14,
    textAlign: "center",
  },
  clerkInfo: {
    marginTop: 12,
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
});
