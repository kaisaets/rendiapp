import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { ORDERS } from "@/src/components/admin/orders/ordersData";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { OrdersRow } from "@/src/components/admin/orders/OrdersRow";
import { OrdersSearchBar } from "@/src/components/admin/orders/OrdersSearchBar";

export default function OrdersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return ORDERS;
    }

    return ORDERS.filter(
      (order) =>
        order.title.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized) ||
        order.status.toLowerCase().includes(normalized),
    );
  }, [search]);

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
});
