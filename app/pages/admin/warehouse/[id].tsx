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

import { OrdersHeader } from "@/src/components/admin/orders/OrdersHeader";
import { getSuulineById } from "@/src/features/suulised/api";
import type { Suuline } from "@/src/lib/api/types";

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function hasValue(value: string | number | null | undefined) {
  return value !== null && value !== undefined && value !== "";
}

export default function WarehouseProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [product, setProduct] = useState<Suuline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/warehouse" as any);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!id) {
        setError("Toote ID puudub.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getSuulineById(id);

        if (!isMounted) {
          return;
        }

        setProduct(data);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setError("Valitud toote andmeid ei õnnestunud laadida.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="LAOSEIS" onBack={handleBack} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Laen toote andmeid...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product || error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="LAOSEIS" onBack={handleBack} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Suulist ei leitud</Text>
          <Text style={styles.emptyText}>
            {error ?? "Valitud toote andmed puuduvad."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <OrdersHeader title={"TOODE"} onBack={handleBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.imageCard}>
          <Text style={styles.imageLabel}>{product.nimi}</Text>
          <View style={styles.imageFrame}>
            <Image
              source={require("@/assets/images/HugoF_angle-nobg.png")}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.quickInfoRow}>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Staatus</Text>
            <Text style={styles.quickInfoValue}>
              {formatValue(product.staatus)}
            </Text>
          </View>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Rendihind</Text>
            <Text style={styles.quickInfoValue}>
              {formatValue(product.hind_paev)}
              {hasValue(product.hind_paev) ? (
                <Text style={styles.quickInfoCurrency}> €</Text>
              ) : null}
            </Text>
          </View>
          <View style={styles.quickInfoChip}>
            <Text style={styles.quickInfoLabel}>Müügihind</Text>
            <Text style={styles.quickInfoValue}>
              {formatValue(product.buyout_price)}
              {hasValue(product.buyout_price) ? (
                <Text style={styles.quickInfoCurrency}> €</Text>
              ) : null}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Kirjeldus</Text>
          <Text style={styles.descriptionText}>
            {formatValue(product.kirjeldus)}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Toote andmed</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>ID</Text>
            <Text style={styles.infoValue}>{formatValue(product.id)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Materjal</Text>
            <Text style={styles.infoValue}>
              {formatValue(product.material)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Suurus</Text>
            <Text style={styles.infoValue}>{formatValue(product.suurus)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Paksus</Text>
            <Text style={styles.infoValue}>
              {formatValue(product.thickness)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Tüüp</Text>
            <Text style={styles.infoValue}>{formatValue(product.tuup1)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Rõngas</Text>
            <Text style={styles.infoValue}>
              {formatValue(product.ring_type)}
            </Text>
          </View>
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
    height: 280,
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
  quickInfoCurrency: {
    color: "#A1A1A1",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
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
  descriptionText: {
    color: "#D9D9D9",
    fontSize: 13,
    lineHeight: 22,
    fontFamily: "QuicksandRegular",
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
  },
  infoValue: {
    color: "#F2F2F2",
    fontSize: 12,
    lineHeight: 20,
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
