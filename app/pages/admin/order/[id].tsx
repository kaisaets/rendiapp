import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Client } from "@/src/components/admin/clients/ClientData";
import { ClientRow } from "@/src/components/admin/clients/ClientRow";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { getRentimineById } from "@/src/features/rentimised/api";
import {
  mapRentimineToAdminOrder,
  type AdminOrderView,
} from "@/src/features/rentimised/orderFormat";

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [order, setOrder] = useState<AdminOrderView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericId = Number.parseInt(String(id ?? ""), 10);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/orders" as any);
  };

  const orderClient: Client | null = order
    ? {
        id: order.clientId,
        name: order.customer,
        phone: order.phone,
        address: order.address,
        status: "Aktiivne",
        statusInfo: order.status,
        activeRentals: [],
        completedRentals: [],
      }
    : null;

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (Number.isNaN(numericId)) {
        if (isMounted) {
          setOrder(null);
          setError("Tellimust ei leitud");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getRentimineById(numericId);
        if (!isMounted) {
          return;
        }

        setOrder(mapRentimineToAdminOrder(data));
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setOrder(null);
        setError("Tellimust ei leitud");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [numericId]);

  if (!loading && !order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="TELLIMUS" onBack={handleBack} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Tellimust ei leitud</Text>
          <Text style={styles.emptyText}>
            {error || "Valitud tellimus puudub andmetes."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <OrdersHeader title="TELLIMUS" onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {loading ? (
          <Text style={styles.infoText}>Laen tellimuse andmeid...</Text>
        ) : null}

        <View style={styles.imageCard}>
          <Text style={styles.imageLabel}>{order?.title ?? "Tellimus"}</Text>
          <View style={styles.imageFrame}>
            <Image
              source={require("@/assets/images/HugoL_angle-nobg.png")}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Staatus</Text>
            <Text style={styles.quickInfoValue}>{order?.status ?? "-"}</Text>
          </View>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Algus</Text>
            <Text style={styles.quickInfoValue}>{order?.startDate ?? "-"}</Text>
          </View>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Lõpp</Text>
            <Text style={styles.quickInfoValue}>
              {order?.returnDate ?? "-"}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Tellimuse kokkuvõte</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tellimus ID</Text>
            <Text style={styles.infoValue}>{order?.id ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Toode</Text>
            <Text style={styles.infoValue}>{order?.title ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Rendiperioodi algus</Text>
            <Text style={styles.infoValue}>{order?.startDate ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tagastamine</Text>
            <Text style={styles.infoValue}>{order?.returnDate ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Arve kokku</Text>
            <Text style={styles.infoValue}>{order?.total ?? "-"}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Kliendi andmed</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Nimi</Text>
            <Text style={styles.infoValue}>{order?.customer ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Email</Text>
            <Text style={styles.infoValue}>{order?.email ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Telefon</Text>
            <Text style={styles.infoValue}>{order?.phone ?? "-"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Aadress</Text>
            <Text style={styles.infoValue}>{order?.address ?? "-"}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Kliendikaart</Text>
          {orderClient ? (
            <ClientRow
              client={orderClient}
              onPress={() =>
                router.push(`/pages/admin/client/${orderClient.id}` as any)
              }
            />
          ) : null}
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  summarySection: {
    marginTop: 6,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#232323",
    paddingHorizontal: 12,
  },
  infoText: {
    color: "#9A9A9A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    marginBottom: 8,
  },
  imageCard: {
    marginBottom: 16,
  },
  imageLabel: {
    color: "#F8F8F8",
    fontSize: 22,
    fontFamily: "QuicksandBold",
    marginBottom: 12,
  },
  imageFrame: {
    height: 220,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  quickInfoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  quickInfoChip: {
    flex: 1,
    minHeight: 62,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    justifyContent: "space-between",
  },
  quickInfoLabel: {
    color: "#909090",
    fontSize: 10,
    fontFamily: "QuicksandRegular",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  quickInfoValue: {
    color: "#F3D497",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  infoCard: {
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#232323",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: "#F0F0F0",
    fontSize: 16,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
  },
  infoKey: {
    color: "#9B9B9B",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
    flex: 1,
  },
  infoValue: {
    color: "#F2F2F2",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "QuicksandRegular",
    flex: 1,
    textAlign: "right",
  },
  emptyState: {
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
