import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getOrderById } from "@/src/components/admin/orders/ordersData";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { OrdersRow } from "@/src/components/admin/orders/OrdersRow";

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/orders" as any);
  };

  const order = getOrderById(id);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="TELLIMUS" onBack={handleBack} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Tellimust ei leitud</Text>
          <Text style={styles.emptyText}>
            Valitud tellimus puudub andmetes.
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
        <View style={styles.summarySection}>
          <OrdersRow order={order} />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>{order.customer}</Text>
          <Text style={styles.infoText}>{order.email}</Text>
          <Text style={styles.infoText}>{order.phone}</Text>
          <Text style={styles.infoText}>{order.address}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Tagastamine: {order.returnDate}</Text>
          <Text style={styles.infoText}>Arve kokku: {order.total}</Text>
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
    marginBottom: 28,
  },
  infoSection: {
    marginBottom: 34,
  },
  infoText: {
    color: "#E6E6E6",
    fontSize: 12,
    lineHeight: 21,
    fontFamily: "QuicksandRegular",
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
