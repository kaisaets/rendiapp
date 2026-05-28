import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    View,
} from "react-native";

import { products } from "@/src/components/home/homeData";
import {
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

type Product = { id?: string; title?: string; price?: number };

interface AddProductHeaderProps {
  onBack: () => void;
}

// (static order layout) No external products import; display static values as requested

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function SectionRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: TextStyle;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={[styles.sectionValue, valueStyle]}>{value}</Text>
    </View>
  );
}

export default function Order({ onBack }: AddProductHeaderProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const product: Product | undefined = products.find((item) => item.id === id);
  // static layout — no params required
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent={false} />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBanner}>
          <Pressable
            style={styles.headerBack}
            onPress={() => {
              if (typeof onBack === "function") {
                onBack();
              } else if (id) {
                router.push({ pathname: "/pages/[id]", params: { id } });
              } else {
                router.back();
              }
            }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#0A0A0A"
            />
          </Pressable>
          <Text style={styles.headerLabel}>TELLIMUS</Text>
        </View>

        <View style={styles.innerContent}>
          <View style={styles.card}>
            <SectionTitle title={product?.title ?? "HUGO liikuva rõngaga"} />
            <SectionRow label="Rendihind" value="70 €" />

            <SectionTitle title="Rendiperiood" />
            <SectionRow label="Rendiperiood" value="2 nädalat" />

            <SectionRow label="Transport" value="€3" />
            <View style={styles.divider} />
            <SectionRow
              label="Kokku"
              value="€73"
              valueStyle={styles.totalValue}
            />
          </View>

          <View style={styles.card}>
            <SectionTitle title="Tarneaadress" />
            <Text style={styles.fieldText}>
              Maakond, vald, linn, tänav, number
            </Text>
          </View>

          <View style={styles.card}>
            <SectionTitle title="Makseviis" />
            <Text style={styles.fieldText}>**** **** **** **** 1234</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.primaryButton} onPress={() => undefined}>
          <Text style={styles.primaryButtonText}>Rendi toode</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  page: {
    flex: 1,
  },
  content: {
    paddingBottom: 160,
  },

  innerContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerBanner: {
    backgroundColor: "#C89B3C",
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 64,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBack: {
    position: "absolute",
    left: 12,
    width: 48,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  headerLabel: {
    color: "#0A0A0A",
    fontSize: 24,
    fontFamily: "Quicksand_700Bold",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  productName: {
    color: "#0A0A0A",
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 42,
    marginBottom: 8,
    textAlign: "center",
  },
  productPrice: {
    color: "#0A0A0A",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#121212",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  title: {
    color: "#F5F5F5",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#F5F5F5",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    color: "#B5B5B5",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionValue: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    color: "#D4AF57",
    fontWeight: "700",
  },
  fieldText: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "400",
    backgroundColor: "#1A1A1A",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  body: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 10,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#C89B3C",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "rgba(10, 10, 10, 0.98)",
  },
});
