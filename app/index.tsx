import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import Navbar from "@/src/components/Navbar";
import { BottomTabs } from "@/src/components/home/BottomTabs";
import { HeroBanner } from "@/src/components/home/HeroBanner";
import { ProductCard, type Product } from "@/src/components/home/ProductCard";
import { SearchBar } from "@/src/components/home/SearchBar";
import { SectionHeader } from "@/src/components/home/SectionHeader";
import { StepsSection } from "@/src/components/home/StepsSection";
import { getSuulised } from "@/src/features/suulised/api";
import type { Suuline } from "@/src/lib/api/types";

const featureSteps = ["Vali", "Proovi", "Otsusta"];

const FALLBACK_IMAGES = [
  require("@/assets/images/HugoF_angle-nobg.png"),
  require("@/assets/images/HugoL_angle-nobg.png"),
];

function mapSuulineToProduct(suuline: Suuline, index: number): Product {
  const title = [suuline.nimi, suuline.ring_type]
    .filter(Boolean)
    .join(" ")
    .trim();
  const dayPrice = Number(suuline.hind_paev ?? 0);

  return {
    id: String(suuline.id),
    title: title || `Suuline #${suuline.id}`,
    kirjeldus: suuline.kirjeldus?.trim() || "",
    infoLines: [
      suuline.suurus ? `Suurus: ${suuline.suurus} cm` : "Suurus: -",
      dayPrice > 0 ? `Hind: ${dayPrice.toFixed(2)} €/päev` : "Hind: -",
      suuline.staatus ? `Staatus: ${suuline.staatus}` : "Staatus: -",
    ],
    rating: 5,
    image: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  };
}

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [productsView, setProductsView] = useState<"popular" | "all">(
    "popular",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const riseUp = useRef(new Animated.Value(18)).current;
  const router = useRouter();

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

  useEffect(() => {
    let isMounted = true;

    async function loadSuulised() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSuulised();

        if (!isMounted) {
          return;
        }

        setProducts(data.map(mapSuulineToProduct));
      } catch (e) {
        if (!isMounted) {
          return;
        }

        const message =
          e instanceof Error ? e.message : "Suuliste laadimine ebaõnnestus.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSuulised();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts =
    productsView === "all" ? products : products.slice(0, 3);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href={"/sign-in" as any} />;
  }

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

            <BottomTabs
              activeTab={productsView}
              onPressPopular={() => setProductsView("popular")}
              onPressAll={() => setProductsView("all")}
            />

            <SectionHeader
              title={
                productsView === "all"
                  ? "Kõik suulised"
                  : "Populaarsed suulised"
              }
            />

            {loading ? (
              <Text style={styles.feedbackText}>Laen suulisi...</Text>
            ) : null}

            {error ? <Text style={styles.errorText}>Viga: {error}</Text> : null}

            <View style={styles.listWrap}>
              {visibleProducts.map((product) => (
                // Wrap the card in a pressable link container pointing to the dynamic path
                <TouchableOpacity
                  key={product.id}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/product/${product.id}`)}
                >
                  <ProductCard product={product} />
                </TouchableOpacity>
              ))}

              {!loading && !error && products.length === 0 ? (
                <Text style={styles.feedbackText}>Suuliseid ei leitud.</Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
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
    paddingBottom: 90,
  },
  mainContent: {
    paddingHorizontal: 12,
  },
  listWrap: {
    marginBottom: 18,
  },
  feedbackText: {
    marginTop: 8,
    color: "#A78D60",
    fontSize: 12,
  },
  errorText: {
    marginTop: 8,
    color: "#E99292",
    fontSize: 12,
  },
});
