import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  getRentimineById,
  updateRentimine,
} from "@/src/features/rentimised/api";
import {
  isBoughtRentimine,
  isCompletedRentimine,
} from "@/src/features/rentimised/status";
import type { Rentimine } from "@/src/lib/api/types";

const { width } = Dimensions.get("window");

export default function MyBits() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [rentalItem, setRentalItem] = useState<Rentimine | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRental() {
      if (!id) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getRentimineById(id);
        if (!isMounted) {
          return;
        }

        setRentalItem(data);
      } catch {
        if (isMounted) {
          Alert.alert("Viga", "Rendi andmete laadimine ebaõnnestus.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadRental();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading || !rentalItem) {
    return null;
  }

  const productName = [rentalItem.suuline?.nimi, rentalItem.suuline?.ring_type]
    .filter(Boolean)
    .join(" ")
    .trim();
  const resolvedName = productName || `Toode #${rentalItem.suuline_id}`;
  const statusText = String(rentalItem.staatus ?? "").trim();
  const isBought = isBoughtRentimine(rentalItem);
  const isCompleted = isCompletedRentimine(rentalItem);

  const handleBuyout = async () => {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await updateRentimine(rentalItem.id, {
        staatus: "müüdud",
        lopp_kuupaev: new Date().toISOString(),
        paid: true,
      });
      setRentalItem(updated);
      Alert.alert("Tehtud", "Toode on märgitud välja ostetuks.");
    } catch {
      Alert.alert("Viga", "Väljaostu salvestamine ebaõnnestus.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReturn = async () => {
    if (isUpdating) {
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await updateRentimine(rentalItem.id, {
        staatus: "tagastatud",
        lopp_kuupaev: new Date().toISOString(),
      });
      setRentalItem(updated);
      Alert.alert("Tehtud", "Rentimine on märgitud tagastatuks.");
    } catch {
      Alert.alert("Viga", "Tagastuse salvestamine ebaõnnestus.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadReceipt = () =>
    alert("Kviitungi allalaadimine käivitatud...");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
      bounces={false}
    >
      <View style={styles.goldHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCompleted ? "SUULINE" : "MINU RENDID"}
        </Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.content}>
        <View style={styles.goldBorderImageCard}>
          <Image
            source={require("@/assets/images/HugoL_angle-nobg.png")}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.mainTitle}>{resolvedName}</Text>
        {isCompleted && (
          <Text style={styles.completedStatusBadge}>
            {isBought ? "Välja ostetud" : "Tagastatud"}
          </Text>
        )}
        {!isCompleted ? (
          <>
            <View style={styles.statusCard}>
              <Text style={styles.statusTitleText}>Prooviperiood käib</Text>
              <Text
                style={styles.daysCounterText}
              >{`Staatus: ${statusText || "Aktiivne"}`}</Text>
            </View>

            <View style={styles.buttonStack}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleBuyout}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>Sobib - osta välja!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.7}
                onPress={handleReturn}
                disabled={isUpdating}
              >
                <Text style={styles.buttonText}>Ei sobi - tagasta!</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.metaDataBlock}>
              <Text style={styles.metaDataLabel}>Tarneaadress</Text>
              <View style={styles.metaDataBox}>
                <Text style={styles.metaDataBoxValueText}>
                  {rentalItem.aadress || "Aadress puudub"}
                </Text>
              </View>
            </View>

            <View style={styles.metaDataBlock}>
              <Text style={styles.metaDataLabel}>Makseviis</Text>
              <View style={styles.metaDataBoxRow}>
                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={20}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.metaDataBoxValueText}>
                  **** **** **** 1234
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.receiptLinkButton}
              activeOpacity={0.6}
              onPress={handleDownloadReceipt}
            >
              <Text style={styles.receiptLinkText}>Lae alla kviitung</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  goldHeader: {
    backgroundColor: "#CC9D36",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSpacer: { width: 40 },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  goldBorderImageCard: {
    backgroundColor: "#0A0A0A",
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: "#CC9D36",
    width: "100%",
    aspectRatio: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  productImage: { width: "80%", height: "80%" },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  completedStatusBadge: {
    color: "#4CD964",
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginTop: 12,
    marginBottom: 24,
  },
  metaDataBlock: { width: "100%", marginBottom: 20 },
  metaDataLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  metaDataBox: {
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  metaDataBoxRow: {
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  metaDataBoxValueText: { color: "#CCCCCC", fontSize: 14, fontWeight: "400" },
  receiptLinkButton: {
    marginTop: 40,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  receiptLinkText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  statusCard: {
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  statusTitleText: {
    color: "#1C1C1E",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  daysCounterText: { color: "#8E8E93", fontSize: 14, fontWeight: "400" },
  buttonStack: { width: "100%", gap: 14 },
  actionButton: {
    backgroundColor: "#CC9D36",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
});
