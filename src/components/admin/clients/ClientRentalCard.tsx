import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ClientRental } from "@/src/components/admin/clients/ClientData";

interface ClientRentalCardProps {
  rental: ClientRental;
  onPress?: () => void;
}

export function ClientRentalCard({ rental, onPress }: ClientRentalCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.82}
      onPress={onPress}
    >
      <Image source={rental.image} style={styles.image} resizeMode="contain" />

      <View style={styles.infoWrap}>
        <Text style={styles.title}>{rental.title}</Text>
        <Text style={styles.subtitle}>{rental.subtitle}</Text>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={18} color="#8A8A8A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 84,
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
  infoWrap: {
    flex: 1,
    paddingLeft: 6,
    justifyContent: "center",
    gap: 5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  subtitle: {
    color: "#7C7C7C",
    fontSize: 10,
    fontFamily: "QuicksandRegular",
  },
});
