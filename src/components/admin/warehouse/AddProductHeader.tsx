import GBstyles from "@/src/theme/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface AddProductHeaderProps {
  onBack: () => void;
}

export function AddProductHeader({ onBack }: AddProductHeaderProps) {
  return (
    <View style={GBstyles.headerContainer}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color="#0A0A0A" />
      </TouchableOpacity>
      <Text style={GBstyles.headerText}>LISA TOODE</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 36,
  },
});
