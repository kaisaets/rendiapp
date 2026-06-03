import Navbar from "@/src/components/Navbar";
import { getRentimisedByKasutajaId } from "@/src/features/rentimised/api";
import { isCompletedRentimine } from "@/src/features/rentimised/status";
import type { Rentimine } from "@/src/lib/api/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  return {
    rental_id: item.id,
    name: item.suuline?.nimi || `Toode #${item.suuline_id}`,
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

  // TODO: asenda login-süsteemi kasutaja ID-ga, kui auth on lisatud.
  const currentUserId = Number(process.env.EXPO_PUBLIC_USER_ID || 1);

  const [activeTab, setActiveTab] = useState("rentals");
  const [rentals, setRentals] = useState<Rentimine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRentals() {
      if (!Number.isFinite(currentUserId) || currentUserId <= 0) {
        setError("EXPO_PUBLIC_USER_ID on vigane või puudub.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getRentimisedByKasutajaId(currentUserId);

        if (!isMounted) {
          return;
        }

        setRentals(data);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        setError(
          e instanceof Error ? e.message : "Rentide laadimine ebaõnnestus.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRentals();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  const cards = useMemo(() => rentals.map(mapRentimineToCard), [rentals]);

  const activeRentals = cards.filter((item) => !item.isCompleted);
  const completedRentals = cards.filter((item) => item.isCompleted);

  const RentalCard = ({ item }: { item: (typeof cards)[number] }) => (
    <TouchableOpacity
      style={styles.rentalCard}
      activeOpacity={0.8}
      onPress={() => router.push(`/rentals/${item.rental_id}`)}
    >
      <View style={styles.cardImageContainer}>
        {/* Updated source prop to seamlessly render your local photo asset */}
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
            ? "Rendiaeg lõppenud"
            : `Jäänud ${item.days_left} päeva`}
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
    <>
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
              Sul pole hetkel ühtegi aktiivset renti.
            </Text>
          ) : null}

          <Text style={styles.sectionHeader}>Lõpetatud</Text>
          {!loading && completedRentals.length > 0 ? (
            completedRentals.map((rental) => (
              <RentalCard key={rental.rental_id} item={rental} />
            ))
          ) : !loading ? (
            <Text style={styles.emptyText}>Ajalugu on tühi.</Text>
          ) : null}
        </ScrollView>

        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },

  goldHeader: {
    backgroundColor: "#CC9D36",
    height: 56,
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
    backgroundColor: "#0A0A0A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    height: 90,
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImageContainer: {
    width: 100,
    height: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
  },
  cardImage: { width: "85%", height: "85%" },
  cardInfoContainer: { flex: 1, paddingLeft: 14, justifyContent: "center" },
  productName: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  daysText: { color: "#8E8E93", fontSize: 12, marginTop: 12 },
  arrowIcon: { paddingHorizontal: 14 },

  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  navBarContainer: {
    flexDirection: "row",
    backgroundColor: "#846226",
    width: "100%",
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 5,
  },
  navTab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  activeNavTab: {
    backgroundColor: "#CC9D36",
    opacity: 1,
  },
});
