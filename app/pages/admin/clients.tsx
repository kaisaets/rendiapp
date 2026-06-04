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
import { type Client } from "@/src/components/admin/clients/ClientData";
import { ClientRow } from "@/src/components/admin/clients/ClientRow";
import { ClientsHeader } from "@/src/components/admin/clients/ClientsHeader";
import { ClientsSearchBar } from "@/src/components/admin/clients/ClientsSearchBar";
import { subscribeKasutajadChanged } from "@/src/components/admin/metadata/addClient/events";
import { getActiveRentalCount } from "@/src/features/kasutajad/activeCount";
import { getKasutajad } from "@/src/features/kasutajad/api";
import type { Kasutaja } from "@/src/lib/api/types";

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [kasutajad, setKasutajad] = useState<Kasutaja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadKasutajad() {
      try {
        setLoading(true);
        const data = await getKasutajad();
        if (!isMounted) {
          return;
        }
        setKasutajad(data);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }
        setError("Klientide laadimine ebaõnnestus.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadKasutajad();
    const unsubscribe = subscribeKasutajadChanged(loadKasutajad);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const [activeCounts, setActiveCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    async function fetchCounts() {
      const entries = await Promise.all(
        kasutajad.map(async (k) => {
          try {
            const count = await getActiveRentalCount(k.id);
            return [String(k.id), count] as const;
          } catch {
            return [String(k.id), 0] as const;
          }
        }),
      );
      if (!cancelled) {
        setActiveCounts(Object.fromEntries(entries));
      }
    }
    if (kasutajad.length > 0) fetchCounts();
    return () => {
      cancelled = true;
    };
  }, [kasutajad]);

  const clients: Client[] = useMemo(
    () =>
      kasutajad.map((k) => ({
        id: String(k.id),
        name: k.nimi?.trim() || k.email,
        phone: k.telefon?.trim() || "Telefon puudub",
        address: k.email,
        status: "Puudub", // või "Aktiivne" kui soovid
        statusInfo: k.roll,
        activeRentals: [],
        completedRentals: [],
      })),
    [kasutajad],
  );

  const filteredClients = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(normalized) ||
        client.phone.toLowerCase().includes(normalized) ||
        client.address.toLowerCase().includes(normalized) ||
        client.status.toLowerCase().includes(normalized),
    );
  }, [search, clients]);

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
        {loading ? <Text style={styles.infoText}>Laen kliente...</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && filteredClients.length === 0 ? (
          <Text style={styles.infoText}>Ühtegi klienti ei leitud.</Text>
        ) : null}
        {!loading && !error
          ? filteredClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                activeCount={activeCounts[client.id] ?? 0}
                onPress={() =>
                  router.push(`/pages/admin/client/${client.id}` as any)
                }
              />
            ))
          : null}
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
