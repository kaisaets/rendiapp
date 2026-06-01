import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { products } from "@/src/components/home/homeData";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Toodet ei leitud</Text>
          <Pressable style={styles.backButton} onPress={() => router.push("./pages/index.tsx")}>
            <Text style={styles.backButtonText}>Tagasi avalehele</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kicker}>Dummy detail-leht</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.kirjeldus}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Sobivus</Text>
          {(product.sobivusItems ?? []).map((line, index) => (
            <Text key={`${product.id}-detail-${index}`} style={styles.infoLine}>
              • {line}
            </Text>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Lisainfo</Text>
          {(product.infoLines ?? []).map((line, index) => (
            <Text key={`${product.id}-extra-${index}`} style={styles.infoLine}>
              {line}
            </Text>
          ))}
          <Text style={styles.rating}>
            Hinnang: {product.rating.toFixed(1)}
          </Text>
        </View>

        <Pressable style={styles.backButton} onPress={() => router.push("./pages/index.tsx")}>
          <Text style={styles.backButtonText}>Tagasi avalehele</Text>
        </Pressable>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push({ pathname: "./pages/order", params: { id } })}
        >
          <Text style={styles.backButtonText}>Vaata tellimust</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 12,
  },
  kicker: {
    color: "#C49E55",
    fontSize: 12,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  title: {
    color: "#F5F5F5",
    fontSize: 26,
    fontWeight: "700",
  },
  description: {
    color: "#DDDDDD",
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#3E2A0D",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#111111",
    gap: 4,
  },
  sectionTitle: {
    color: "#F3D497",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoLine: {
    color: "#E8E8E8",
    fontSize: 13,
    lineHeight: 18,
  },
  rating: {
    marginTop: 8,
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 14,
    backgroundColor: "#C49E55",
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#0A0A0A",
    fontSize: 14,
    fontWeight: "700",
  },
});
