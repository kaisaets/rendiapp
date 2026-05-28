import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface WarehouseAddButtonProps {
  onPress?: () => void;
}

export function WarehouseAddButton({ onPress }: WarehouseAddButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.label}>Lisa toode</Text>
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
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A0A0A",
    fontFamily: "QuicksandBold",
    letterSpacing: 0.5,
  },
});
