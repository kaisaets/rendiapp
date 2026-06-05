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
    <View style={styles.page}>
      <View style={styles.heroSection}>
        <ImageBackground
          source={require("../../assets/images/Hero.png")}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />
        </ImageBackground>
      </View>

      <View style={styles.authSection}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  heroSection: {
     height: 400,
  },
  heroBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  authSection: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  contentCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#141414",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#BDBDBD",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  veaTekst: {
    color: "#F27C78",
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
    marginTop: 18,
    fontSize: 12,
    color: "#A8A8A8",
    textAlign: "center",
  },
});
