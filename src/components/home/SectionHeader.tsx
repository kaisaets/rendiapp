import { FONT_FAMILY_BOLD } from "@/src/theme/typography";
import { StyleSheet, Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontFamily: FONT_FAMILY_BOLD,
  },
});
