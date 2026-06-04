import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

interface WarehouseSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function WarehouseSearchBar({
  value,
  onChangeText,
}: WarehouseSearchBarProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={20}
        color="#666666"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder="Otsi suulist..."
        placeholderTextColor="#555555"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "QuicksandRegular",
  },
});
