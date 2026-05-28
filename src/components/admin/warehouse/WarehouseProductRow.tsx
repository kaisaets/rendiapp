import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
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
}

export function WarehouseProductRow({
  id,
  title,
  category,
  image,
  onPress,
}: WarehouseProductRowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>ID: {id}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#CC9D36" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
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
});
