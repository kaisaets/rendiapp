import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { subscribeRentimisedChanged } from "@/src/components/admin/metadata/orders/events";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { OrdersRow } from "@/src/components/admin/orders/OrdersRow";
import { OrdersSearchBar } from "@/src/components/admin/orders/OrdersSearchBar";
import { getRentimised } from "@/src/features/rentimised/api";
import {
  mapRentimineToAdminOrder,
  type AdminOrderView,
} from "@/src/features/rentimised/orderFormat";

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<AdminOrderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        const data = await getRentimised();
        if (!isMounted) {
          return;
        }

        setOrders(data.map(mapRentimineToAdminOrder));
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Tellimuste laadimine ebaõnnestus.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    const unsubscribe = subscribeRentimisedChanged(loadOrders);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.title.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized) ||
        order.status.toLowerCase().includes(normalized),
    );
  }, [orders, search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <OrdersHeader />
      <OrdersSearchBar value={search} onChangeText={setSearch} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.infoText}>Laen tellimusi...</Text>
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && filteredOrders.length === 0 ? (
          <Text style={styles.infoText}>Ühtegi tellimust ei leitud.</Text>
        ) : null}
        {filteredOrders.map((order) => (
          <OrdersRow
            key={order.id}
            order={order}
            onPress={() => router.push(`/pages/admin/order/${order.id}` as any)}
          />
        ))}
      </ScrollView>

      <Navbar activeTab="Tellimused" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#070707",
    paddingBottom: Platform.OS === "ios" ? 88 : 68,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 96,
  },
  infoText: {
    color: "#9A9A9A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    paddingVertical: 14,
  },
  errorText: {
    color: "#E97A7A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    paddingVertical: 14,
  },
});
