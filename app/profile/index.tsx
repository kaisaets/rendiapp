import Navbar from "@/src/components/Navbar";
import { syncAuthenticatedKasutaja } from "@/src/features/kasutajad/api";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [telefon, setTelefon] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/sign-in" as any} />;
  }

  const fullName = user?.fullName || user?.username || "Kasutaja";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const displayEmail = email || "Email puudub";
  const clerkId = user?.id || "";

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (!clerkId || !email) {
        return;
      }

      try {
        setProfileError(null);
        const me = await syncAuthenticatedKasutaja({
          clerk_id: clerkId,
          email,
          nimi: fullName,
        });

        if (!isMounted) {
          return;
        }

        setTelefon(me.telefon || "");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Profiili laadimine ebaõnnestus.";
        setProfileError(message);
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [clerkId, email, fullName]);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in" as any);
    } catch (error) {
      console.error("Väljalogimine ebaõnnestus:", error);
      setIsSigningOut(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!clerkId || isSavingProfile) {
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileError(null);
      setProfileMessage(null);

      const updated = await syncAuthenticatedKasutaja({
        clerk_id: clerkId,
        email,
        nimi: fullName,
        telefon,
      });

      setTelefon(updated.telefon || "");
      setProfileMessage("Telefon uuendatud.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Profiili salvestamine ebaõnnestus.";
      setProfileError(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFIIL</Text>
      </View>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>{displayEmail}</Text>

          <View style={styles.metaWrap}>
            <Text style={styles.metaLabel}>Telefon</Text>
            <TextInput
              value={telefon}
              onChangeText={setTelefon}
              keyboardType="phone-pad"
              placeholder="Sisesta telefoninumber"
              placeholderTextColor="#777777"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSavingProfile && styles.saveButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSaveProfile}
            disabled={isSavingProfile}
          >
            <Text style={styles.saveButtonText}>
              {isSavingProfile ? "Salvestan..." : "Salvesta telefon"}
            </Text>
          </TouchableOpacity>

          {profileMessage ? (
            <Text style={styles.successText}>{profileMessage}</Text>
          ) : null}
          {profileError ? (
            <Text style={styles.errorText}>{profileError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => router.push("/rentals")}
        >
          <Text style={styles.actionButtonText}>Vaata minu rente</Text>
        </TouchableOpacity>

        <View style={styles.logoutCard}>
          <Text style={styles.logoutTitle}>Väljalogimine</Text>
          <Text style={styles.logoutHint}>
            Vajuta nuppu, kui soovid konto sessiooni lõpetada.
          </Text>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isSigningOut && styles.logoutButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text style={styles.logoutButtonText}>
              {isSigningOut ? "Logib välja..." : "Logi välja"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    height: 56,
    backgroundColor: "#CC9D36",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#101010",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  page: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  card: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 14,
    padding: 16,
  },
  name: {
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "700",
  },
  email: {
    color: "#BDBDBD",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  metaWrap: {
    marginTop: 10,
  },
  metaLabel: {
    color: "#A78D60",
    fontSize: 12,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: {
    color: "#E8E8E8",
    fontSize: 13,
  },
  input: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#343434",
    backgroundColor: "#191919",
    color: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#CC9D36",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },
  successText: {
    marginTop: 10,
    color: "#74D68A",
    fontSize: 12,
  },
  errorText: {
    marginTop: 10,
    color: "#E99292",
    fontSize: 12,
  },
  actionButton: {
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutCard: {
    backgroundColor: "#1A0F10",
    borderWidth: 1,
    borderColor: "#5D1F23",
    borderRadius: 12,
    padding: 14,
  },
  logoutTitle: {
    color: "#FFB7BD",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutHint: {
    color: "#EBCED2",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#B4222D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
