import { StyleSheet, Text, View } from "react-native";

export function BottomTabs() {
  return (
    <View style={styles.shell}>
      <View style={styles.tabActive}>
        <Text style={styles.activeLabel}>Populaarsed suulised</Text>
      </View>

      <View style={styles.tabItem}>
        <Text style={styles.label}>Vaata kõiki</Text>
      </View>
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
  tabActive: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#D2A951",
  },
  tabItem: {
    flex: 1,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
