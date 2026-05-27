import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GoogleSignInButton({ onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.googleButton, disabled && styles.googleButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <View style={styles.logoWrap}>
        <FontAwesome name="google" size={18} color="#4285F4" />
      </View>
      <Text style={styles.googleButtonText}>Logi sisse Google'iga</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#474747",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  googleButtonDisabled: {
    opacity: 0.55,
  },
  logoWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f8ff",
  },
  googleButtonText: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "700",
  },
});
