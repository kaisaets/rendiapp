import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

interface ClientsSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function ClientsSearchBar({
  value,
  onChangeText,
}: ClientsSearchBarProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={22}
        color="#8C8C8C"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder="Otsi suulisi..."
        placeholderTextColor="#6F6F6F"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "QuicksandRegular",
  },
});
