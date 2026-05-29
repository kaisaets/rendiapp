import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getClientById } from "@/src/components/admin/clients/ClientData";
import { ClientRentalCard } from "@/src/components/admin/clients/ClientRentalCard";
import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";

export default function AdminClientDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/clients" as any);
  };

  const client = getClientById(id);

  if (!client) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="KLIENT" onBack={handleBack} />

        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Klienti ei leitud</Text>
          <Text style={styles.emptyText}>Valitud kliendi andmed puuduvad.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <OrdersHeader title={client.name} onBack={handleBack} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.clientInfoCard}>
          <Text style={styles.clientInfoTitle}>Kliendi info</Text>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Nimi:</Text>
            <Text style={styles.clientInfoValue}>{client.name}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>ID:</Text>
            <Text style={styles.clientInfoValue}>{client.id}</Text>
          </View>

          <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Telefon:</Text>
            <Text style={styles.clientInfoValue}>{client.phone}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktiivsed</Text>
          {client.activeRentals.length > 0 ? (
            client.activeRentals.map((rental) => (
              <ClientRentalCard key={rental.id} rental={rental} />
            ))
          ) : (
            <Text style={styles.emptySectionText}>
              Aktiivseid renditehinguid pole
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lõpetatud</Text>
          {client.completedRentals.length > 0 ? (
            client.completedRentals.map((rental) => (
              <ClientRentalCard key={rental.id} rental={rental} />
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
