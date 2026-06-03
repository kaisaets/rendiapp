import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function MyBits() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Captures the rental_id from the clicked card

  const [rentalItem] = useState({
    rental_id: id,
    name: "HUGO liikuva rõngaga",
    local_image: require("@/assets/images/HugoL_angle-nobg.png"),
    status: "rendis",
    end_date: "2026-06-05",
    days_left: 8,
  });

  const handleBuyout = () => {
    alert(
      `Toode ${rentalItem.name} välja ostetud! (SQL: UPDATE rentals SET status='müüdud' WHERE rental_id=${id})`,
    );
  };

  const handleReturn = () => {
    alert(
      `Tagastusprotsess algatatud! (SQL: UPDATE rentals SET status='tagastatud' WHERE rental_id=${id})`,
    );
  };
  return (
    <>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.goldHeader}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MINU RENDID</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.content}>
          <View style={styles.goldBorderImageCard}>
            <Image
              source={rentalItem.local_image}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.mainTitle}>{rentalItem.name}</Text>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitleText}>Prooviperiood käib</Text>
            <Text
              style={styles.daysCounterText}
            >{`Jäänud ${rentalItem.days_left} päeva`}</Text>
          </View>

          <View style={styles.buttonStack}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={handleBuyout}
            >
              <Text style={styles.buttonText}>Sobib - osta välja!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={handleReturn}
            >
              <Text style={styles.buttonText}>Ei sobi - tagasta!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
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
    marginBottom: 40,
  },
  statusCard: {
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
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
