import Navbar from "@/src/components/Navbar";
import { getSuulised } from "@/src/features/suulised/api";
import type { Suuline } from "@/src/lib/api/types";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FALLBACK_IMAGES = [
  require("@/assets/images/HugoF_angle-nobg.png"),
  require("@/assets/images/HugoL_angle-nobg.png"),
];

const CARD_GAP = 10;
const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP * 2) / 3;

type StatusFilter = "all" | "Saadaval" | "Renditud";

export default function SearchScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("search");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Suuline[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ringFilter, setRingFilter] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSuulised();

        if (!isMounted) {
          return;
        }

        setItems(data);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        setError(
          e instanceof Error
            ? e.message
            : "Otsinguandmete laadimine ebaõnnestus.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const ringOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.ring_type) {
        set.add(item.ring_type);
      }
    }

    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (statusFilter !== "all" && item.staatus !== statusFilter) {
        return false;
      }

      if (ringFilter !== "all" && item.ring_type !== ringFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        item.nimi,
        item.kirjeldus,
        item.ring_type,
        item.material,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [items, query, statusFilter, ringFilter]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/sign-in" as any} />;
  }

  const renderChip = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      key={label}
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OTSI KATALOOGIST</Text>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.topSection}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Otsi nime, kirjelduse või tüübi järgi"
              placeholderTextColor="#8A8A8A"
              style={styles.searchInput}
            />

            <View style={styles.filterBlock}>
              <Text style={styles.filterTitle}>Staatus</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipRow}>
                  {renderChip("Kõik", statusFilter === "all", () =>
                    setStatusFilter("all"),
                  )}
                  {renderChip("Saadaval", statusFilter === "Saadaval", () =>
                    setStatusFilter("Saadaval"),
                  )}
                  {renderChip("Renditud", statusFilter === "Renditud", () =>
                    setStatusFilter("Renditud"),
                  )}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterBlock}>
              <Text style={styles.filterTitle}>Ring type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipRow}>
                  {ringOptions.map((option) =>
                    renderChip(
                      option === "all" ? "Kõik" : option,
                      ringFilter === option,
                      () => setRingFilter(option),
                    ),
                  )}
                </View>
              </ScrollView>
            </View>

            {loading ? (
              <Text style={styles.infoText}>Laen kataloogi...</Text>
            ) : null}
            {error ? <Text style={styles.errorText}>Viga: {error}</Text> : null}
            {!loading ? (
              <Text style={styles.infoText}>
                Leitud: {filteredItems.length} toodet
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => {
          const title = [item.nimi, item.ring_type]
            .filter(Boolean)
            .join(" ")
            .trim();

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image
                source={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <Text numberOfLines={2} style={styles.cardTitle}>
                {title || `Suuline #${item.id}`}
              </Text>
              <Text numberOfLines={1} style={styles.cardMeta}>
                {item.hind_paev
                  ? `${Number(item.hind_paev).toFixed(2)} €/päev`
                  : "Hind: -"}
              </Text>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Sobivaid tooteid ei leitud.</Text>
          ) : null
        }
      />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    height: 56,
    backgroundColor: "#CC9D36",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#101010",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  topSection: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#313131",
    borderRadius: 10,
    color: "#F4F4F4",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterBlock: {
    marginTop: 12,
  },
  filterTitle: {
    color: "#D7BA84",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "#353535",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipSelected: {
    backgroundColor: "#CC9D36",
    borderColor: "#CC9D36",
  },
  chipText: {
    color: "#D5D5D5",
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#111111",
  },
  gridContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 12,
    paddingBottom: 96,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    borderRadius: 10,
    padding: 8,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.95,
    borderRadius: 8,
    backgroundColor: "#0A0A0A",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#F5F5F5",
    fontSize: 12,
    fontWeight: "700",
    minHeight: 32,
  },
  cardMeta: {
    color: "#CFAE73",
    fontSize: 11,
    marginTop: 4,
  },
  infoText: {
    marginTop: 10,
    color: "#A78D60",
    fontSize: 12,
  },
  errorText: {
    marginTop: 10,
    color: "#E99292",
    fontSize: 12,
  },
  emptyText: {
    color: "#999999",
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
  },
});
