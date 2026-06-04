import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/src/components/admin/Navbar";
import { WarehouseAddButton } from "@/src/components/admin/warehouse/WarehouseAddButton";
import { WarehouseHeader } from "@/src/components/admin/warehouse/WarehouseHeader";
import { WarehouseProductRow } from "@/src/components/admin/warehouse/WarehouseProductRow";
import { WarehouseSearchBar } from "@/src/components/admin/warehouse/WarehouseSearchBar";
import { getRentimised } from "@/src/features/rentimised/api";
import { deleteSuuline, getSuulised } from "@/src/features/suulised/api";
import type { Suuline } from "@/src/lib/api/types";

export default function WarehousePage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"laoseis" | "liikumine">(
    "laoseis",
  );
  const [search, setSearch] = useState("");
  const [suulised, setSuulised] = useState<Suuline[]>([]);
  const [statusBySuulineId, setStatusBySuulineId] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Suuline | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function getWarehouseStatus(item: Suuline) {
    return statusBySuulineId[item.id] || item.staatus || "Saadaval";
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSuulised() {
      try {
        setLoading(true);
        const [suulisedData, rentimisedData] = await Promise.all([
          getSuulised(),
          getRentimised(),
        ]);

        const nextStatuses: Record<number, string> = {};
        for (const rentimine of rentimisedData) {
          const suulineId = Number(rentimine.suuline_id);
          if (!Number.isFinite(suulineId)) {
            continue;
          }

          const statusText = String(rentimine.staatus ?? "").toLowerCase();
          if (/m[üu]üdud|v[äa]lja ostetud|sold|bought/i.test(statusText)) {
            nextStatuses[suulineId] = "Välja ostetud";
            continue;
          }

          if (/tagastatud|returned/i.test(statusText)) {
            if (!nextStatuses[suulineId]) {
              nextStatuses[suulineId] = "Saadaval";
            }
            continue;
          }

          nextStatuses[suulineId] = "Rentimisel";
        }

        if (!isMounted) {
          return;
        }

        setSuulised(suulisedData);
        setStatusBySuulineId(nextStatuses);
        setError(null);
      } catch {
        if (!isMounted) {
          return;
        }
        setError("Lao andmete laadimine ebaõnnestus.");
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

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return suulised;
    }

    return suulised.filter((item) =>
      item.nimi.toLowerCase().includes(normalized),
    );
  }, [search, suulised]);

  async function handleConfirmDelete() {
    if (!deleteTarget || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteSuuline(deleteTarget.id);
      setSuulised((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      setError(null);
    } catch {
      setError("Toote kustutamine ebaõnnestus.");
    } finally {
      setIsDeleting(false);
    }
  }

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
        {loading ? (
          <Text style={styles.infoText}>Laen lao andmeid...</Text>
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {!loading && !error && filtered.length === 0 ? (
          <Text style={styles.infoText}>Ühtegi toodet ei leitud.</Text>
        ) : null}
        {!loading && !error
          ? filtered.map((item) => (
              <WarehouseProductRow
                key={String(item.id)}
                id={String(item.id)}
                title={item.nimi}
                category={getWarehouseStatus(item)}
                image={require("@/assets/images/HugoF_angle-nobg.png")}
                onPress={() =>
                  router.push(`/pages/admin/warehouse/${item.id}` as any)
                }
                onDeletePress={() => setDeleteTarget(item)}
              />
            ))
          : null}
      </ScrollView>

      <Modal
        visible={Boolean(deleteTarget)}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalBackdropPressable}
            onPress={() => {
              if (!isDeleting) {
                setDeleteTarget(null);
              }
            }}
          />

          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Kustuta toode?</Text>
            <Text style={styles.modalText}>
              Kas soovid kustutada toote "{deleteTarget?.nimi}"?
            </Text>
            <Text style={styles.modalTextMuted}>
              See tegevus kustutab kirje andmebaasist.
            </Text>

            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Tühista</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isDeleting && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                <Text style={styles.confirmButtonText}>
                  {isDeleting ? "Kustutan..." : "OK, kustuta"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  infoText: {
    color: "#9A9A9A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: "#E97A7A",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalBackdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3A2222",
    backgroundColor: "#101010",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 6,
  },
  modalTitle: {
    color: "#F5E4C3",
    fontSize: 20,
    fontFamily: "QuicksandBold",
  },
  modalText: {
    color: "#E5E5E5",
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
  modalTextMuted: {
    color: "#A1A1A1",
    fontSize: 12,
    fontFamily: "QuicksandRegular",
    marginTop: 2,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  modalButton: {
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  cancelButton: {
    borderColor: "#2F2F2F",
    backgroundColor: "#171717",
  },
  confirmButton: {
    borderColor: "#6A2D2D",
    backgroundColor: "#2A1414",
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#D4D4D4",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  confirmButtonText: {
    color: "#F2B8B8",
    fontSize: 12,
    fontFamily: "QuicksandBold",
  },
});
