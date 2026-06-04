import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface WarehouseProductRowProps {
  id: string;
  title: string;
  category: string;
  image: ImageSourcePropType;
  onPress?: () => void;
  onDeletePress?: () => void;
}

export function WarehouseProductRow({
  id,
  title,
  category,
  image,
  onPress,
  onDeletePress,
}: WarehouseProductRowProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.mainPressable}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Image source={image} style={styles.image} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>ID: {id}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color="#CC9D36"
        />
      </TouchableOpacity>

      <Pressable
        style={styles.deleteButton}
        onPress={onDeletePress}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={18}
          color="#E97A7A"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
    paddingRight: 8,
  },
  mainPressable: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "QuicksandSemiBold",
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: "#666666",
    fontFamily: "QuicksandRegular",
  },
  category: {
    fontSize: 11,
    color: "#888888",
    fontFamily: "QuicksandRegular",
    marginTop: 1,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1010",
    borderWidth: 1,
    borderColor: "#3A2222",
  },
});
