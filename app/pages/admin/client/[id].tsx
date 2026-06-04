import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ClientRental } from "@/src/components/admin/clients/ClientData";
import { ClientRentalCard } from "@/src/components/admin/clients/ClientRentalCard";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { getKasutajaDetail } from "@/src/features/kasutajad/api";
import { isCompletedRentimine } from "@/src/features/rentimised/status";
import type { KasutajaDetail, KasutajaRentimine } from "@/src/lib/api/types";

function formatDate(value?: string | null) {
  if (!value) {
    return "Kuupäev puudub";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("et-EE");
}

function toClientRental(rentimine: KasutajaRentimine): ClientRental {
  const isCompleted = isCompletedRentimine(rentimine);
  const title =
    rentimine.suuline?.nimi?.trim() || `Toode #${rentimine.suuline_id}`;

  const statusText = String(rentimine.staatus ?? "").trim();
  const statusSuffix = statusText ? ` • ${statusText}` : "";
  const subtitle = isCompleted
    ? `Lõpp: ${formatDate(rentimine.lopp_kuupaev)}${statusSuffix}`
    : `Algus: ${formatDate(rentimine.algus_kuupaev)}${statusSuffix}`;

  return {
    id: String(rentimine.id),
    title,
    subtitle,
    address: rentimine.aadress?.trim() || "Aadress puudub",
    image: require("@/assets/images/HugoL_angle-nobg.png"),
  };
}

export default function AdminClientDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [client, setClient] = useState<KasutajaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericId = Number.parseInt(String(id ?? ""), 10);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/clients" as any);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadClient() {
      if (Number.isNaN(numericId)) {
        if (isMounted) {
          setClient(null);
          setError("Klienti ei leitud");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getKasutajaDetail(numericId);

        if (!isMounted) {
          return;
        }

        setClient(data);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setClient(null);
        setError("Klienti ei leitud");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadClient();

    return () => {
      isMounted = false;
    };
  }, [numericId]);

  const activeRentals = useMemo(() => {
    const rentimised = client?.rentimised ?? [];
    return rentimised
      .filter((rentimine) => !isCompletedRentimine(rentimine))
      .map(toClientRental);
  }, [client]);

  const completedRentals = useMemo(() => {
    const rentimised = client?.rentimised ?? [];
    return rentimised
      .filter((rentimine) => isCompletedRentimine(rentimine))
      .map(toClientRental);
  }, [client]);

  const displayName = client?.nimi?.trim() || client?.email || "KLIENT";
  const displayPhone = client?.telefon?.trim() || "Telefon puudub";

  if (!loading && !client) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="KLIENT" onBack={handleBack} />

        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Klienti ei leitud</Text>
          <Text style={styles.emptyText}>
            {error || "Valitud kliendi andmed puuduvad."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <OrdersHeader title={displayName} onBack={handleBack} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.infoText}>Laen kliendi andmeid...</Text>
        ) : null}

        <View style={styles.clientInfoCard}>
          <Text style={styles.clientInfoTitle}>Kliendi info</Text>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Nimi:</Text>
            <Text style={styles.clientInfoValue}>{displayName}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>ID:</Text>
            <Text style={styles.clientInfoValue}>{client?.id ?? "-"}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Telefon:</Text>
            <Text style={styles.clientInfoValue}>{displayPhone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktiivsed</Text>
          <Text style={styles.activeCount}>
            Aktiivseid tellimusi: {activeRentals.length}
          </Text>
          {activeRentals.length > 0 ? (
            activeRentals.map((rental) => (
              <ClientRentalCard
                key={rental.id}
                rental={rental}
                onPress={() =>
                  router.push(`/pages/admin/order/${rental.id}` as any)
                }
              />
            ))
          ) : (
            <Text style={styles.emptySectionText}>
              Aktiivseid renditehinguid pole
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lõpetatud</Text>
          {completedRentals.length > 0 ? (
            completedRentals.map((rental) => (
              <ClientRentalCard
                key={rental.id}
                rental={rental}
                onPress={() =>
                  router.push(`/pages/admin/order/${rental.id}` as any)
                }
              />
            ))
          ) : (
            <Text style={styles.emptySectionText}>
              Lõpetatud renditehinguid pole
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070707",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
    gap: 16,
  },
  section: {
    gap: 0,
  },
  activeCount: {
    color: "#CC9D36",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    marginBottom: 4,
  },
  clientInfoCard: {
    borderWidth: 1,
    borderColor: "#8D681B",
    borderRadius: 10,
    backgroundColor: "#0C0C0C",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  clientInfoTitle: {
    color: "#F0F0F0",
    fontSize: 14,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 4,
  },
  clientInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clientInfoLabel: {
    color: "#C89B3C",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
    minWidth: 58,
  },
  clientInfoValue: {
    color: "#E6E6E6",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
    flex: 1,
  },
  sectionTitle: {
    color: "#F0F0F0",
    fontSize: 24,
    fontFamily: "QuicksandSemiBold",
  },
  infoText: {
    color: "#9A9A9A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
  emptySectionText: {
    color: "#888888",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "QuicksandBold",
    marginBottom: 8,
  },
  emptyText: {
    color: "#B5B5B5",
    fontSize: 13,
    fontFamily: "QuicksandRegular",
  },
});
