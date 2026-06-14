import React from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReturnGuide() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleDownloadLabel = () => {
    alert("Tagastussildi allalaadimine käivitatud...");
  };

  const steps = [
    { id: "1", text: "Paki suuline korralikult" },
    { id: "2", text: "Kasuta tagastussilti" },
    { id: "3", text: "Vii pakiautomaati" },
  ];

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
        <Text style={styles.headerTitle}>TAGASTAMINE</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>Tagasta suuline</Text>
        <View style={styles.stepsContainer}>
          {steps.map((step) => (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>{step.id}</Text>
              </View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={handleDownloadLabel}
        >
          <Text style={styles.buttonText}>Laadi alla tagastussilt</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Tagastusjuhised</Text>
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
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: "center",
  },
  mainTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  stepsContainer: {
    width: "auto",
    minWidth: 260,
    marginBottom: 60,
    gap: 24,
    alignSelf: "center",
  },
  stepRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CC9D36",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  stepNumber: { color: "#000000", fontSize: 18, fontWeight: "bold" },
  stepText: { color: "#FFFFFF", fontSize: 16, fontWeight: "400", flex: 1 },
  actionButton: {
    backgroundColor: "#CC9D36",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
  footerText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 10,
  },
});
