import { Pressable, StyleSheet, Text, View } from "react-native";

type BottomTabsProps = {
  activeTab: "popular" | "all";
  onPressPopular: () => void;
  onPressAll: () => void;
};

export function BottomTabs({
  activeTab,
  onPressPopular,
  onPressAll,
}: BottomTabsProps) {
  return (
    <View style={styles.shell}>
      <Pressable
        style={[
          styles.tabItem,
          activeTab === "popular" ? styles.tabActive : null,
        ]}
        onPress={onPressPopular}
      >
        <Text
          style={activeTab === "popular" ? styles.activeLabel : styles.label}
        >
          Populaarsed suulised
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tabItem, activeTab === "all" ? styles.tabActive : null]}
        onPress={onPressAll}
      >
        <Text style={activeTab === "all" ? styles.activeLabel : styles.label}>
          Vaata kõiki
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginTop: 14,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4A3718",
    backgroundColor: "#0A0A0A",
    borderRadius: 15,
    overflow: "hidden",
  },
  tabItem: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  tabActive: {
    backgroundColor: "#D2A951",
  },
  activeLabel: {
    color: "#1F1406",
    fontSize: 12,
    fontWeight: "700",
  },
  label: {
    color: "#A78D60",
    fontSize: 12,
    fontWeight: "600",
  },
});
