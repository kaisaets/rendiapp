import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { HeroBanner } from "@/src/components/home/HeroBanner";

const SECTIONS = [
  { label: "Aktiivsed tellimused", count: 4 },
  { label: "Makse ootel", count: 2 },
  { label: "Tagastused", count: 2 },
];

export default function AdminHome() {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const riseUp = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(riseUp, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeIn, riseUp]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeIn, transform: [{ translateY: riseUp }] }}
        >
          <HeroBanner />

          <View style={styles.mainContent}>
            <Text style={styles.title}>Tere tulemast tagasi!</Text>

            {SECTIONS.map((section) => (
              <View key={section.label} style={styles.section}>
                <Text style={styles.sectionLabel}>{section.label}</Text>
                <Text style={styles.sectionCount}>
                  {section.count} tellimust
                </Text>
                <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
                  <Text style={styles.moreBtnText}>Näita rohkem →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <Navbar activeTab="Avaleht" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  page: {
    flex: 1,
  },
  content: {
    paddingBottom: 132,
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "QuicksandBold",
    marginBottom: 28,
    display: "flex",
    margin: "auto",
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingVertical: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#CCCCCC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: "QuicksandBold",
    marginBottom: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "QuicksandRegular",
  },
  moreBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  moreBtnText: {
    fontSize: 13,
    color: "#CC9D36",
    fontFamily: "QuicksandMedium",
  },
});
