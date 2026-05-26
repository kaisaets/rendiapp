import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabs } from "@/src/components/home/BottomTabs";
import { HeroBanner } from "@/src/components/home/HeroBanner";
import { ProductCard } from "@/src/components/home/ProductCard";
import { SearchBar } from "@/src/components/home/SearchBar";
import { SectionHeader } from "@/src/components/home/SectionHeader";
import { StepsSection } from "@/src/components/home/StepsSection";
import { featureSteps, products } from "@/src/components/home/homeData";

export default function Index() {
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
          style={{
            opacity: fadeIn,
            transform: [{ translateY: riseUp }],
          }}
        >
          <HeroBanner />

          <View style={styles.mainContent}>
            <SearchBar />

            <StepsSection title="Kuidas see toimib?" steps={featureSteps} />

            <BottomTabs />

            <SectionHeader title="Populaarsed suulised" />

            <View style={styles.listWrap}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
    paddingTop: 8,
    paddingBottom: 26,
  },
  mainContent: {
    paddingHorizontal: 12,
  },
  listWrap: {
    marginBottom: 18,
  },
});
