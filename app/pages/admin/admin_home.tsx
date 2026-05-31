import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { subscribeRentimisedChanged } from "@/src/components/admin/metadata/orders/events";
import { getRentimised } from "@/src/features/rentimised/api";
import {
  isActiveRentimine,
  isCompletedRentimine,
  isPendingPaymentRentimine,
  isReturnedRentimine,
} from "@/src/features/rentimised/status";
import { useRouter } from "expo-router";

type HomeSection = {
  key: string;
  label: string;
  count: number;
  route: string;
};

const INITIAL_SECTIONS: HomeSection[] = [
  {
    key: "active",
    label: "Aktiivsed tellimused",
    count: 0,
    route: "/pages/admin/orders",
  },
  {
    key: "pending-payment",
    label: "Makse ootel",
    count: 0,
    route: "/pages/admin/orders",
  },
  {
    key: "returns",
    label: "Tagastused",
    count: 0,
    route: "/pages/admin/orders",
  },
  {
    key: "completed",
    label: "Lõpetatud tellimused",
    count: 0,
    route: "/pages/admin/orders",
  },
];

export default function AdminHome() {
  const router = useRouter();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const riseUp = useRef(new Animated.Value(18)).current;
  const [sections, setSections] = useState<HomeSection[]>(INITIAL_SECTIONS);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(riseUp, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, riseUp]);

  useEffect(() => {
    let isMounted = true;

    async function loadMetrics() {
      try {
        setLoadingMetrics(true);
        const rentimised = await getRentimised();

        if (!isMounted) {
          return;
        }

        const activeCount = rentimised.filter((rentimine) =>
          isActiveRentimine(rentimine),
        ).length;
        const pendingPaymentCount = rentimised.filter((rentimine) =>
          isPendingPaymentRentimine(rentimine),
        ).length;
        const returnsCount = rentimised.filter((rentimine) =>
          isReturnedRentimine(rentimine),
        ).length;
        const completedCount = rentimised.filter((rentimine) =>
          isCompletedRentimine(rentimine),
        ).length;

        setSections([
          {
            key: "active",
            label: "Aktiivsed tellimused",
            count: activeCount,
            route: "/pages/admin/orders",
          },
          {
            key: "pending-payment",
            label: "Makse ootel",
            count: pendingPaymentCount,
            route: "/pages/admin/orders",
          },
          {
            key: "returns",
            label: "Tagastused",
            count: returnsCount,
            route: "/pages/admin/orders",
          },
          {
            key: "completed",
            label: "Lõpetatud tellimused",
            count: completedCount,
            route: "/pages/admin/orders",
          },
        ]);
        setMetricsError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setMetricsError("Avalehe andmete laadimine ebaõnnestus.");
      } finally {
        if (isMounted) {
          setLoadingMetrics(false);
        }
      }
    }

    loadMetrics();
    const unsubscribe = subscribeRentimisedChanged(loadMetrics);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeIn, transform: [{ translateY: riseUp }] }}
        >
          <View style={styles.mainContent}>
            <Text style={styles.title}>Tere tulemast tagasi!</Text>
            {loadingMetrics ? (
              <Text style={styles.helperText}>Laen avalehe andmeid...</Text>
            ) : null}
            {metricsError ? (
              <Text style={styles.errorText}>{metricsError}</Text>
            ) : null}

            {sections.map((section) => (
              <View key={section.key} style={styles.section}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                <Text style={styles.sectionCount}>
                  {section.count} tellimust
                </Text>
                <TouchableOpacity
                  style={styles.moreBtn}
                  activeOpacity={0.7}
                  onPress={() => router.push(section.route as any)}
                >
                  <Text style={styles.moreBtnText}>Näita rohkem →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <Navbar activeTab="Avaleht" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  page: {
    flex: 1,
  },
  content: {
    paddingBottom: 132,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "QuicksandBold",
    marginBottom: 28,
    display: "flex",
    margin: "auto",
  },
  helperText: {
    color: "#9A9A9A",
    fontSize: 13,
    fontFamily: "QuicksandRegular",
    marginBottom: 6,
    textAlign: "center",
  },
  errorText: {
    color: "#E97A7A",
    fontSize: 13,
    fontFamily: "QuicksandRegular",
    marginBottom: 6,
    textAlign: "center",
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingVertical: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#CCCCCC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "QuicksandBold",
    marginBottom: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "QuicksandRegular",
  },
  moreBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  moreBtnText: {
    fontSize: 13,
    color: "#CC9D36",
    fontFamily: "QuicksandMedium",
  },
});
