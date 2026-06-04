import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { AdminOrderView } from "@/src/features/rentimised/orderFormat";

interface OrdersRowProps {
  order: AdminOrderView;
  onPress?: () => void;
}

export function OrdersRow({ order, onPress }: OrdersRowProps) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.82} onPress={onPress}>
      <Image source={order.image} style={styles.image} resizeMode="contain" />

      <View style={styles.info}>
        <Text style={styles.title}>{order.title}</Text>
        <Text style={styles.customer}>{order.customer}</Text>
        <Text style={styles.address}>{order.address}</Text>
        <Text style={styles.status}>{order.status}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={20} color="#6F4D0A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#8D681B",
    paddingVertical: 10,
  },
  image: {
    width: 74,
    height: 54,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#EAEAEA",
    fontSize: 14,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 3,
  },
  customer: {
    color: "#999999",
    fontSize: 11,
    fontFamily: "QuicksandRegular",
    marginBottom: 2,
  },
  address: {
    color: "#B6B6B6",
    fontSize: 11,
    fontFamily: "QuicksandRegular",
    marginBottom: 2,
  },
  status: {
    color: "#8E8E8E",
    fontSize: 11,
    fontFamily: "QuicksandRegular",
  },
});
