import HugoL_angle_nobg from "@/assets/images/HugoL_angle-nobg.png";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const productId = Array.isArray(id) ? id[0] : id;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [suuline, setSuuline] = useState<Suuline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSuuline() {
      if (!productId) {
        setError("Toote ID puudub.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getSuulineById(productId);

        if (!isMounted) {
          return;
        }

        setSuuline(data);
      } catch (e) {
        if (!isMounted) {
          return;
        }

        setError(
          e instanceof Error ? e.message : "Toote laadimine ebaõnnestus.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSuuline();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const bitFromDatabase = {
    bit_id: 1,
    name: "Hugo",
    material: "Titanium",
    size: 125,
    status: "Saadaval",
    daily_rate: 5.0,
    description:
      "Suuline lukustub ettepoole, pakkudes stabiilset kontakti hobustele, kes kipuvad suulist taga ajama. Lubab samas rohkem liikuvust ja sobib hobustele, kes vajavad pehmemat märguannet.",
    type: "lukustuv",
    ring_type: "fixed ring",
    thickness: 14,
    buyout_price: 149.0,
  };

  const sizeOptions = ["11.5 cm", "12.5 cm", "13.5 cm"];
  const durationOptions = ["1 nädal", "2 nädalat"];

  const baseWeeklyPrice = (bitFromDatabase.daily_rate * 7).toFixed(0);

  const getTotalSum = () => {
    const days = selectedDuration === "2 nädalat" ? 14 : 7;
    return (bitFromDatabase.daily_rate * days).toFixed(2);
  };

  const isFormValid = selectedSize !== null && selectedDuration !== null;

  const handleContinue = () => {
    if (!isFormValid) {
      return;
    }

    router.push({
      pathname: "/pages/order",
      params: {
        id,
        duration: selectedDuration,
        rentPrice: getTotalSum(),
        size: selectedSize,
      },
    });
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suulise andmed</Text>
        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={styles.headerButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#CC9D36" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageCard}>
          <Image
            source={HugoL_angle_nobg}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoMetaSection}>
          <Text style={styles.mainTitle}>
            {bitFromDatabase.name.toUpperCase()} {bitFromDatabase.ring_type}
          </Text>
          <Text style={styles.priceTag}>{baseWeeklyPrice}€ / nädal</Text>
        </View>

        <View style={styles.selectorsRow}>
          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              selectedSize
                ? styles.dropdownSelectedBorder
                : styles.dropdownDefaultBorder,
            ]}
            activeOpacity={0.8}
            onPress={() => setIsSizeDropdownOpen(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: selectedSize ? "#FFFFFF" : "#8E8E93" },
              ]}
            >
              {selectedSize ? `Suurus: ${selectedSize}` : "Vali suurus"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#CC9D36" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dropdownSelector,
              selectedDuration
                ? styles.dropdownSelectedBorder
                : styles.dropdownDefaultBorder,
            ]}
            activeOpacity={0.8}
            onPress={() => setIsDurationDropdownOpen(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                { color: selectedDuration ? "#FFFFFF" : "#8E8E93" },
              ]}
            >
              {selectedDuration
                ? `Periood: ${selectedDuration}`
                : "Vali periood"}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#CC9D36" />
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionHeader}>Kirjeldus</Text>
          <View style={styles.conditionBox}>
            <Text style={styles.conditionBodyText}>
              {bitFromDatabase.description}
            </Text>
          </View>
        </View>

        <View style={styles.propertiesContainer}>
          <Text style={styles.sectionHeader}>Omadused</Text>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Materjal:</Text>
            <Text style={styles.propertyValue}>{bitFromDatabase.material}</Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Rõnga tüüp:</Text>
            <Text style={styles.propertyValue}>
              {bitFromDatabase.ring_type}
            </Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Tüüp:</Text>
            <Text style={styles.propertyValue}>{bitFromDatabase.type}</Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Paksus:</Text>
            <Text style={styles.propertyValue}>
              {bitFromDatabase.thickness} mm
            </Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Väljaostuhind:</Text>
            <Text style={styles.propertyValue}>
              €{bitFromDatabase.buyout_price?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.propertyRow}>
            <Text style={styles.propertyKey}>Staatus laos:</Text>
            <Text
              style={[
                styles.propertyValue,
                {
                  color:
                    bitFromDatabase.status === "Saadaval"
                      ? "#4CD964"
                      : "#FF3B30",
                },
              ]}
            >
              {bitFromDatabase.status}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SIZE MODAL */}
      <Modal
        visible={isSizeDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSizeDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSizeDropdownOpen(false)}
        >
          <View style={styles.dropdownMenuCard}>
            <Text style={styles.modalTitle}>Vali sobiv suurus</Text>
            {sizeOptions.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.modalOptionRow,
                  selectedSize === size && styles.activeOptionRow,
                ]}
                onPress={() => {
                  setSelectedSize(size);
                  setIsSizeDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSize === size && styles.activeOptionText,
                  ]}
                >
                  {size}
                </Text>
                {selectedSize === size && (
                  <Ionicons name="checkmark" size={18} color="#CC9D36" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DURATION MODAL */}
      <Modal
        visible={isDurationDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDurationDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDurationDropdownOpen(false)}
        >
          <View style={styles.dropdownMenuCard}>
            <Text style={styles.modalTitle}>Vali rendiperiood</Text>
            {durationOptions.map((duration) => (
              <TouchableOpacity
                key={duration}
                style={[
                  styles.modalOptionRow,
                  selectedDuration === duration && styles.activeOptionRow,
                ]}
                onPress={() => {
                  setSelectedDuration(duration);
                  setIsDurationDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedDuration === duration && styles.activeOptionText,
                  ]}
                >
                  {duration}
                </Text>
                {selectedDuration === duration && (
                  <Ionicons name="checkmark" size={18} color="#CC9D36" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* TOTAL SUMMARY BLOCK (Only visible when selections are made) */}
      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
        ]}
      >
        {isFormValid && (
          <View style={styles.totalSummaryRow}>
            <Text style={styles.totalSummaryLabel}>
              Summa kokku ({selectedDuration}):
            </Text>
            <Text style={styles.totalSummaryValue}>€{getTotalSum()}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.primaryCTAButton,
            !isFormValid && styles.disabledButton,
          ]}
          activeOpacity={0.8}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text
            style={[
              styles.ctaButtonText,
              { color: isFormValid ? "#121212" : "#8E8E93" },
            ]}
          >
            {isFormValid ? "Jätka" : "Täida valikud jätkamiseks"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#121212" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  headerButton: { padding: 4, width: 40 },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: { padding: 16, paddingBottom: 150 }, // Increased bottom padding to avoid hiding content under summary row
  imageCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    height: width * 0.65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  productImage: { width: "80%", height: "80%" },
  infoMetaSection: { marginBottom: 20 },
  mainTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "bold" },
  priceTag: { color: "#CC9D36", fontSize: 16, fontWeight: "600", marginTop: 6 },

  selectorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  dropdownSelector: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownDefaultBorder: { borderColor: "#333333" },
  dropdownSelectedBorder: { borderColor: "#CC9D36" },
  dropdownText: { fontSize: 13, fontWeight: "500" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenuCard: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 12,
    width: width * 0.8,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    marginBottom: 4,
  },
  modalOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  activeOptionRow: { backgroundColor: "#222222" },
  optionText: { color: "#FFFFFF", fontSize: 16 },
  activeOptionText: { color: "#CC9D36", fontWeight: "600" },

  sectionHeader: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  descriptionContainer: { marginBottom: 24 },
  conditionBox: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#CC9D36",
    padding: 12,
  },
  conditionBodyText: { color: "#CCCCCC", fontSize: 13, lineHeight: 18 },
  propertiesContainer: { marginBottom: 20 },
  propertyRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  propertyKey: { color: "#8E8E93", width: 110, fontSize: 14 },
  propertyValue: { color: "#FFFFFF", flex: 1, fontSize: 14 },

  // Sticky Footer & Receipt Elements
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#222222",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  totalSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  totalSummaryLabel: { color: "#8E8E93", fontSize: 14, fontWeight: "500" },
  totalSummaryValue: { color: "#CC9D36", fontSize: 18, fontWeight: "bold" },
  primaryCTAButton: {
    backgroundColor: "#CC9D36",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: { backgroundColor: "#2C2C2C" },
  ctaButtonText: { fontSize: 16, fontWeight: "bold" },
});
