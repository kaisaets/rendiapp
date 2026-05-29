import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

interface OrdersSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function OrdersSearchBar({ value, onChangeText }: OrdersSearchBarProps) {
  return (
    <View style={styles.searchShell}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color="#8C8C8C"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Otsi suulisi..."
        placeholderTextColor="#6F6F6F"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchShell: {
    height: 46,
    marginHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    backgroundColor: "#0C0C0C",
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "QuicksandRegular",
  },
});
