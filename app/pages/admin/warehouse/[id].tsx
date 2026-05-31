import { useLocalSearchParams, useRouter } from "expo-router";
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
import { products } from "@/src/components/home/homeData";

export default function WarehouseProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.push("/pages/admin/warehouse" as any);
  };

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <OrdersHeader title="LAOSEIS" onBack={handleBack} />

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Suulist ei leitud</Text>
          <Text style={styles.emptyText}>Valitud toote andmed puuduvad.</Text>
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
          <Text style={styles.imageLabel}>{product.title}</Text>
          <View style={styles.imageFrame}>
            <Image
              source={product.image}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Kirjeldus</Text>
          <Text style={styles.infoText}>{product.kirjeldus}</Text>
        </View>

        {product.sobivusItems?.length ? (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>
              {product.sobivusTitle ?? "Sobivus"}
            </Text>
            {product.sobivusItems.map((line, index) => (
              <Text key={`${product.id}-s-${index}`} style={styles.infoText}>
                • {line}
              </Text>
            ))}
          </View>
        ) : null}

        {product.infoLines?.length ? (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Lisainfo</Text>
            {product.infoLines.map((line, index) => (
              <Text key={`${product.id}-i-${index}`} style={styles.infoText}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Hinnang</Text>
          <Text style={styles.infoText}>{product.rating.toFixed(1)}</Text>
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
    marginBottom: 24,
  },
  imageLabel: {
    color: "#F0F0F0",
    fontSize: 16,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 10,
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
  infoSection: {
    marginBottom: 26,
  },
  sectionTitle: {
    color: "#F0F0F0",
    fontSize: 18,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 8,
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
