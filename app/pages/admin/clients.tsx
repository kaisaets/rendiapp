import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { CLIENTS } from "@/src/components/admin/clients/ClientData";
import { ClientRow } from "@/src/components/admin/clients/ClientRow";
import { ClientsHeader } from "@/src/components/admin/clients/ClientsHeader";
import { ClientsSearchBar } from "@/src/components/admin/clients/ClientsSearchBar";

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return CLIENTS;
    }

    return CLIENTS.filter(
      (client) =>
        client.name.toLowerCase().includes(normalized) ||
        client.phone.toLowerCase().includes(normalized) ||
        client.address.toLowerCase().includes(normalized) ||
        client.status.toLowerCase().includes(normalized),
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ClientsHeader />
      <ClientsSearchBar value={search} onChangeText={setSearch} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredClients.map((client) => (
          <ClientRow
            key={client.id}
            client={client}
            onPress={() =>
              router.push(`/pages/admin/client/${client.id}` as any)
            }
          />
        ))}
      </ScrollView>

      <Navbar activeTab="Kliendid" />
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
