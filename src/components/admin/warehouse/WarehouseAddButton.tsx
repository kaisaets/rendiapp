import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface WarehouseAddButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  label?: string;
}

export function WarehouseAddButton({
  onPress,
  disabled = false,
  label = "Lisa toode",
}: WarehouseAddButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#CC9D36",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A0A0A",
    fontFamily: "QuicksandBold",
    letterSpacing: 0.5,
  },
});
