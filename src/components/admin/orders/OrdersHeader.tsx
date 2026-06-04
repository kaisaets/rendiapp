import GBstyles from "@/src/theme/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OrdersHeaderProps {
  title?: string;
  onBack?: () => void;
}

export function OrdersHeader({
  title = "TELLIMUSED",
  onBack,
}: OrdersHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      {onBack ? (
        <Pressable style={styles.backButton} onPress={onBack} hitSlop={10}>
          <MaterialCommunityIcons name="chevron-left" size={32} color="#000" />
        </Pressable>
      ) : null}

      <Text style={GBstyles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    ...GBstyles.headerContainer,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
});
