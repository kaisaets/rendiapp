import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { WarehouseAddButton } from "@/src/components/admin/warehouse/WarehouseAddButton";
import { WarehouseHeader } from "@/src/components/admin/warehouse/WarehouseHeader";
import { WarehouseProductRow } from "@/src/components/admin/warehouse/WarehouseProductRow";
import { WarehouseSearchBar } from "@/src/components/admin/warehouse/WarehouseSearchBar";
import { products } from "@/src/components/home/homeData";

export default function WarehousePage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"laoseis" | "liikumine">(
    "laoseis",
  );
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <WarehouseHeader activeView={activeView} onViewChange={setActiveView} />
      <WarehouseSearchBar value={search} onChangeText={setSearch} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((product) => (
          <WarehouseProductRow
            key={product.id}
            id={product.id}
            title={product.title}
            category="Ladu"
            image={product.image}
            onPress={() =>
              router.push(`/pages/admin/warehouse/${product.id}` as any)
            }
          />
        ))}
      </ScrollView>

      <WarehouseAddButton
        onPress={() => router.push("/pages/admin/add_product" as any)}
      />
      <Navbar activeTab="warehouse" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingBottom: Platform.OS === "ios" ? 88 : 68,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 80,
  },
});
