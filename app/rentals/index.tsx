import Navbar from "@/src/components/Navbar";
import { syncAuthenticatedKasutaja } from "@/src/features/kasutajad/api";
import { getRentimisedByKasutajaId } from "@/src/features/rentimised/api";
import { isCompletedRentimine } from "@/src/features/rentimised/status";
import type { Rentimine } from "@/src/lib/api/types";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_IMAGE = require("@/assets/images/HugoL_angle-nobg.png");

function getDaysLeft(endDate?: string | null) {
  if (!endDate) {
    return 0;
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return 0;
  }

  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function mapRentimineToCard(item: Rentimine) {
  const title = [item.suuline?.nimi, item.suuline?.ring_type]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    rental_id: item.id,
    name: title || `Toode #${item.suuline_id}`,
    local_image: FALLBACK_IMAGE,
    status: item.staatus || "-",
    end_date: item.lopp_kuupaev || null,
    days_left: getDaysLeft(item.lopp_kuupaev),
    isCompleted: isCompletedRentimine(item),
  };
}

export default function MyRentals() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState("rentals");
  const [rentals, setRentals] = useState<Rentimine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clerkId = user?.id || "";
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";
  const fullName = user?.fullName || user?.username || "Kasutaja";
  const SUPER_ADMIN_EMAIL = process.env.EXPO_PUBLIC_SUPER_ADMIN_EMAIL || "";

  const isAdmin = !!(
    email &&
    email.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase().trim()
  );
  useEffect(() => {
    let isMounted = true;

    async function loadRentals() {
      if (!isLoaded || !isSignedIn) {
        return;
      }

      if (!clerkId || !email) {
        setError("Kasutaja andmed puuduvad.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const me = await syncAuthenticatedKasutaja({
          clerk_id: clerkId,
          email,
          nimi: fullName,
        });

        if (!isMounted) {
          return;
        }

        const data = await getRentimisedByKasutajaId(me.id);

        if (!isMounted) {
          return;
        }

        setRentals(data);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        const message =
          e instanceof Error ? e.message : "Rentide laadimine ebaonnestus.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadRentals();

    return () => {
      isMounted = false;
    };
  }, [isLoaded, isSignedIn, clerkId, email, fullName]);

  const cards = useMemo(() => rentals.map(mapRentimineToCard), [rentals]);

  const activeRentals = cards.filter((item) => !item.isCompleted);
  const completedRentals = cards.filter((item) => item.isCompleted);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/sign-in" as any} />;
  }

  const RentalCard = ({ item }: { item: (typeof cards)[number] }) => (
    <TouchableOpacity
      style={styles.rentalCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/rentals/${item.rental_id}`)}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={item.local_image}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.cardInfoContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.daysText}>
          {item.isCompleted
            ? "Rendiaeg lappenud"
            : `Jaanud ${item.days_left} paeva`}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#8E8E93"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.goldHeader}>
        <Text style={styles.headerTitle}>MINU RENDID</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.emptyText}>Laen rendiandmeid...</Text>
        ) : null}
        {error ? <Text style={styles.errorText}>Viga: {error}</Text> : null}

        <Text style={styles.sectionHeader}>Aktiivsed</Text>
        {!loading && activeRentals.length > 0 ? (
          activeRentals.map((rental) => (
            <RentalCard key={rental.rental_id} item={rental} />
          ))
        ) : !loading ? (
          <Text style={styles.emptyText}>
            Sul pole hetkel uhtegi aktiivset renti.
          </Text>
        ) : null}

        <Text style={styles.sectionHeader}>Lõpetatud</Text>
        {!loading && completedRentals.length > 0 ? (
          completedRentals.map((rental) => (
            <RentalCard key={rental.rental_id} item={rental} />
          ))
        ) : !loading ? (
          <Text style={styles.emptyText}>Ajalugu on tuhi.</Text>
        ) : null}
      </ScrollView>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", backgroundColor: "#000000" },

  goldHeader: {
    backgroundColor: "#CC9D36",
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  headerTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  scrollContainer: { padding: 16, paddingBottom: 100 },
  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 16,
  },
  errorText: { color: "#E99292", fontSize: 14, marginBottom: 16 },

  rentalCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#0A0A0A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    minHeight: 90,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImageContainer: {
    width: 90,
    minWidth: 90,
    height: 90,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
    marginRight: 12,
  },
  cardImage: { width: "85%", height: "85%" },
  cardInfoContainer: { flex: 1, paddingLeft: 14, justifyContent: "center" },
  productName: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  daysText: { color: "#8E8E93", fontSize: 12, marginTop: 12 },
  arrowIcon: { paddingHorizontal: 14 },
});
