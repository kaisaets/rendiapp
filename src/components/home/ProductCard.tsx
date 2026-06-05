import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

export type Product = {
  id: string;
  title: string;
  kirjeldus: string;
  lisainfo?: string;
  lisainfo2?: string;
  sobivusTitle?: string;
  sobivusItems?: string[];
  detailListStyle?: "bullet" | "plain";
  infoLines?: string[];
  rating: number;
  image: ImageSourcePropType;
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const suitabilityItems = product.sobivusItems ?? [];
  const detailListStyle = product.detailListStyle ?? "bullet";
  const infoLines =
    product.infoLines ?? [product.lisainfo, product.lisainfo2].filter(Boolean);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
        </View>

        {suitabilityItems.length > 0 ? (
          <View style={styles.suitabilityWrap}>
            <Text style={styles.suitabilityTitle}>
              {product.sobivusTitle ?? "Sobivus:"}
            </Text>
            {suitabilityItems.map((item, index) => (
              <View
                key={`${product.id}-suit-${index}`}
                style={styles.suitabilityRow}
              >
                {detailListStyle === "bullet" ? (
                  <Text style={styles.bullet}>•</Text>
                ) : null}
                <Text style={styles.suitabilityText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : product.kirjeldus ? (
          <Text style={styles.subtitle}>{product.kirjeldus}</Text>
        ) : null}

        {infoLines.map((line, index) => (
          <Text key={`${product.id}-info-${index}`} style={styles.location}>
            {line}
          </Text>
        ))}

        <View style={styles.bottomRow}>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: product.id },
              })
            }
          >
            <Text style={styles.readMore}>Uuri lähemalt</Text>
            <Ionicons name="arrow-forward" size={16} color="#C49E55" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#3E2A0D",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconWrap: {
    width: "100%",
    height: 110,
    minWidth: 110,
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0A",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "#F5F5F5",
    fontWeight: "700",
    fontSize: 15,
    flex: 1,
  },
  subtitle: {
    marginTop: 5,
    color: "#F5F5F5",
    fontSize: 12,
    lineHeight: 17,
  },
  suitabilityWrap: {
    marginTop: 5,
  },
  suitabilityTitle: {
    color: "#F5F5F5",
    fontSize: 12,
    marginBottom: 2,
  },
  suitabilityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 2,
  },
  bullet: {
    color: "#F5F5F5",
    fontSize: 12,
    lineHeight: 16,
  },
  suitabilityText: {
    flex: 1,
    color: "#F5F5F5",
    fontSize: 12,
    lineHeight: 16,
  },
  location: {
    marginTop: 5,
    color: "#F5F5F5",
    fontSize: 11,
  },
  bottomRow: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  readMore: {
    color: "#C49E55",
    fontSize: 14,
    textDecorationColor: "#C49E55",
  },
});
