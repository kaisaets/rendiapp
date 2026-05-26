import { FONT_FAMILY_BOLD, FONT_FAMILY_REGULAR } from "@/src/theme/typography";
import { StyleSheet, Text, View } from "react-native";

type StepsSectionProps = {
  title: string;
  steps: string[];
};

export function StepsSection({ title, steps }: StepsSectionProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {steps.map((step, index) => (
          <View style={styles.stepItem} key={step}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    fontFamily: FONT_FAMILY_BOLD,
    marginBottom: 10,
    margin: "auto",
    display: "flex",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  stepItem: {
    alignItems: "center",
    gap: 6,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C89B3C",
  },
  badgeText: {
    color: "#1D1408",
    fontFamily: FONT_FAMILY_REGULAR,
    fontSize: 20,
  },
  stepText: {
    color: "#F5F5F5",
    fontSize: 16,
    fontFamily: FONT_FAMILY_REGULAR,
  },
});
