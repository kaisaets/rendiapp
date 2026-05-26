import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({ placeholder = "Otsi suulist..." }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="search" size={18} color="#B7A37A" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8C7A57"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#47351A",
    backgroundColor: "#090909",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  input: {
    flex: 1,
    color: "#F3EBD5",
    fontSize: 14,
  },
});
