import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Client } from "@/src/components/admin/clients/ClientData";

interface ClientRowProps {
  client: Client;
  onPress?: () => void;
}

function getStatusStyle(status: Client["status"]) {
  if (status === "Aktiivne") {
    return styles.statusActive;
  }

  if (status === "Ootel") {
    return styles.statusPending;
  }

  if (status === "Tagastatud") {
    return styles.statusReturned;
  }

  if (status === "Lopetatud") {
    return styles.statusClosed;
  }

  return styles.statusMissing;
}

export function ClientRow({ client, onPress }: ClientRowProps) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.82} onPress={onPress}>
      <View style={styles.leftIconWrap}>
        <MaterialCommunityIcons
          name="account-outline"
          size={20}
          color="#C89B3C"
        />
      </View>

      <View style={styles.infoWrap}>
        <Text style={styles.name}>{client.name}</Text>
        <Text style={styles.meta}>{client.phone}</Text>
        <Text style={styles.meta}>{client.address}</Text>
      </View>

      <View style={styles.rightWrap}>
        <View style={[styles.statusBadge, getStatusStyle(client.status)]}>
          <Text style={styles.statusText}>{client.status}</Text>
        </View>
        {client.statusInfo ? (
          <Text style={styles.statusInfo}>{client.statusInfo}</Text>
        ) : null}
      </View>

      <MaterialCommunityIcons name="chevron-right" size={18} color="#6F4D0A" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#8D681B",
    paddingVertical: 10,
    gap: 8,
  },
  leftIconWrap: {
    width: 22,
    alignItems: "center",
  },
  infoWrap: {
    flex: 1,
  },
  name: {
    color: "#EAEAEA",
    fontSize: 14,
    fontFamily: "QuicksandMedium",
    marginBottom: 3,
  },
  meta: {
    color: "#9B9B9B",
    fontSize: 10,
    fontFamily: "QuicksandRegular",
    lineHeight: 14,
  },
  rightWrap: {
    alignItems: "flex-end",
    marginRight: 2,
    minWidth: 82,
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: "#8D681B",
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginBottom: 3,
  },
  statusActive: {
    backgroundColor: "rgba(200,155,60,0.12)",
  },
  statusPending: {
    backgroundColor: "transparent",
  },
  statusReturned: {
    backgroundColor: "transparent",
  },
  statusClosed: {
    backgroundColor: "transparent",
  },
  statusMissing: {
    backgroundColor: "transparent",
  },
  statusText: {
    color: "#C89B3C",
    fontSize: 11,
    fontFamily: "QuicksandMedium",
  },
  statusInfo: {
    color: "#777777",
    fontSize: 8,
    fontFamily: "QuicksandRegular",
    textAlign: "right",
    lineHeight: 11,
  },
});
