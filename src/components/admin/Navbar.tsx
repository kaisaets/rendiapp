import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NavbarProps {
  activeTab: string;
}

const TABS = [
  {
    id: "Avaleht",
    label: "Avaleht",
    iconActive: "home",
    iconInactive: "home-outline",
    route: "/pages/admin/admin_home",
  },
  {
    id: "warehouse",
    label: "Ladu",
    iconActive: "dropbox",
    iconInactive: "dropbox",
    route: "/pages/admin/warehouse",
  },
  {
    id: "Tellimused",
    label: "Tellimused",
    iconActive: "package-variant",
    iconInactive: "package-variant-closed",
    route: "/pages/admin/admin_home",
  },
  {
    id: "Kliendid",
    label: "Kliendid",
    iconActive: "account",
    iconInactive: "account-outline",
    route: "/pages/admin/admin_home",
  },
];

export default function Navbar({ activeTab }: NavbarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={(isActive ? tab.iconActive : tab.iconInactive) as any}
              size={26}
              color={isActive ? "#CC9D36" : "#999999"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#121212",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    height: Platform.OS === "ios" ? 88 : 68,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#999999",
    marginTop: 5,
  },
  activeLabel: {
    color: "#CC9D36",
    fontWeight: "bold",
  },
});
