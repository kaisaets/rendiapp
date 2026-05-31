import { AddProductDropdown } from "@/src/components/admin/warehouse/AddProductDropdown";
import { AddProductHeader } from "@/src/components/admin/warehouse/AddProductHeader";
import { AddProductPhotoUpload } from "@/src/components/admin/warehouse/AddProductPhotoUpload";
import { WarehouseAddButton } from "@/src/components/admin/warehouse/WarehouseAddButton";
import { createSuuline } from "@/src/features/suulised/api";
import { ApiError } from "@/src/lib/api/http";
import type { CreateSuulineInput } from "@/src/lib/api/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MATERJAL_OPTIONS = [
  "Sweet iron",
  "Titanium",
  "Sweet gold",
  "Rubber",
  "Leather",
  "Stainless steel",
];
const TUUP_OPTIONS = [
  "kaheosaline",
  "kolmeosaline",
  "sirge",
  "lukustuv",
  "muu",
];
const RONGAS_OPTIONS = [
  "loose ring",
  "fixed ring",
  "full cheek",
  "baucher",
  "D ring",
  "gag",
  "Pelham",
];
const SAADAVUS_OPTIONS = ["Saadaval", "Renditud"];

type MaterialValue = NonNullable<CreateSuulineInput["material"]>;
type TuupValue = NonNullable<CreateSuulineInput["tuup1"]>;
type RingTypeValue = NonNullable<CreateSuulineInput["ring_type"]>;
type StaatusValue = NonNullable<CreateSuulineInput["staatus"]>;

const MATERIAL_SET = new Set(MATERJAL_OPTIONS);
const TUUP_SET = new Set(TUUP_OPTIONS);
const RONGAS_SET = new Set(RONGAS_OPTIONS);
const SAADAVUS_SET = new Set(SAADAVUS_OPTIONS);

export default function AddProductPage() {
  const router = useRouter();

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoMimeType, setPhotoMimeType] = useState<string | undefined>();
  const [photoOriginalName, setPhotoOriginalName] = useState<
    string | undefined
  >();
  const [nimi, setNimi] = useState("");
  const [suurus, setSuurus] = useState("");
  const [paksus, setPaksus] = useState("");
  const [materjal, setMaterjal] = useState<MaterialValue | "">("");
  const [tuup, setTuup] = useState<TuupValue | "">("");
  const [rongas, setRongas] = useState<RingTypeValue | "">("");
  const [kirjeldus, setKirjeldus] = useState("");
  const [rendihind, setRendihind] = useState("");
  const [muugihind, setMuugihind] = useState("");
  const [saadavus, setSaadavus] = useState<StaatusValue | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleMaterjalSelect(value: string) {
    if (!value) {
      setMaterjal("");
      return;
    }

    if (MATERIAL_SET.has(value)) {
      setFormError(null);
      setMaterjal(value as MaterialValue);
    }
  }

  function handleTuupSelect(value: string) {
    if (!value) {
      setTuup("");
      return;
    }

    if (TUUP_SET.has(value)) {
      setFormError(null);
      setTuup(value as TuupValue);
    }
  }

  function handleRongasSelect(value: string) {
    if (!value) {
      setRongas("");
      return;
    }

    if (RONGAS_SET.has(value)) {
      setFormError(null);
      setRongas(value as RingTypeValue);
    }
  }

  function handleSaadavusSelect(value: string) {
    if (!value) {
      setSaadavus("");
      return;
    }

    if (SAADAVUS_SET.has(value)) {
      setFormError(null);
      setSaadavus(value as StaatusValue);
    }
  }

  function pickPhotoOnWeb() {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Info",
        "Praegu on pildi valimine seadistatud veebivaate jaoks.",
      );
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result ?? "");
        if (!dataUrl) {
          return;
        }

        const base64 = dataUrl.includes(",")
          ? dataUrl.split(",").pop()
          : dataUrl;

        setPhotoUri(dataUrl);
        setPhotoBase64(base64);
        setPhotoMimeType(file.type || undefined);
        setPhotoOriginalName(file.name || undefined);
        setFormError(null);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }

  async function handleCreateProduct() {
    if (isSubmitting) {
      return;
    }

    if (
      !photoBase64 ||
      !nimi.trim() ||
      !suurus.trim() ||
      !paksus.trim() ||
      !materjal ||
      !tuup ||
      !rongas ||
      !kirjeldus.trim() ||
      !rendihind.trim() ||
      !muugihind.trim() ||
      !saadavus
    ) {
      setFormError("Palun täida kõik väljad ja lisa pilt.");
      return;
    }

    const suurusValue = Number.parseInt(suurus, 10);
    const paksusValue = Number.parseInt(paksus, 10);
    const rendihindValue = Number.parseFloat(rendihind);
    const muugihindValue = Number.parseFloat(muugihind);

    if (
      Number.isNaN(suurusValue) ||
      Number.isNaN(paksusValue) ||
      Number.isNaN(rendihindValue) ||
      Number.isNaN(muugihindValue)
    ) {
      setFormError(
        "Suurus, paksus, rendihind ja müügihind peavad olema numbrid.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      await createSuuline({
        nimi: nimi.trim(),
        material: materjal,
        suurus: suurusValue,
        thickness: paksusValue,
        tuup1: tuup,
        ring_type: rongas,
        kirjeldus: kirjeldus.trim(),
        hind_paev: rendihindValue,
        buyout_price: muugihindValue,
        staatus: saadavus,
        image_base64: photoBase64,
        image_mime_type: photoMimeType,
        image_original_name: photoOriginalName,
      });

      router.replace("/pages/admin/warehouse" as any);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message || "Toote lisamine ebaõnnestus.");
      } else {
        setFormError("Toote lisamine ebaõnnestus.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <AddProductHeader
        onBack={() => router.push("/pages/admin/warehouse" as any)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AddProductPhotoUpload uri={photoUri} onPress={pickPhotoOnWeb} />

          {/* Toote nimi */}
          <TextInput
            nativeID="add-product-nimi"
            style={styles.input}
            placeholder="Toote nimi..."
            placeholderTextColor="#555555"
            value={nimi}
            onChangeText={(value) => {
              setNimi(value);
              setFormError(null);
            }}
          />

          {/* Suurus + Paksus */}
          <View style={styles.row}>
            <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.rowLabel}>Suurus:</Text>
              <TextInput
                nativeID="add-product-suurus"
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={suurus}
                onChangeText={(value) => {
                  setSuurus(value);
                  setFormError(null);
                }}
              />
              <Text style={styles.rowUnit}>mm</Text>
            </View>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <Text style={styles.rowLabel}>Paksus:</Text>
              <TextInput
                nativeID="add-product-paksus"
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={paksus}
                onChangeText={(value) => {
                  setPaksus(value);
                  setFormError(null);
                }}
              />
              <Text style={styles.rowUnit}>mm</Text>
            </View>
          </View>

          {/* Dropdowns */}
          <AddProductDropdown
            label="Materjal"
            options={MATERJAL_OPTIONS}
            value={materjal}
            onSelect={handleMaterjalSelect}
          />
          <AddProductDropdown
            label="Tüüp"
            options={TUUP_OPTIONS}
            value={tuup}
            onSelect={handleTuupSelect}
          />
          <AddProductDropdown
            label="Rõngas"
            options={RONGAS_OPTIONS}
            value={rongas}
            onSelect={handleRongasSelect}
          />

          {/* Kirjeldus */}
          <TextInput
            nativeID="add-product-kirjeldus"
            style={[styles.input, styles.textarea]}
            placeholder="Kirjeldus"
            placeholderTextColor="#555555"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={kirjeldus}
            onChangeText={(value) => {
              setKirjeldus(value);
              setFormError(null);
            }}
          />

          {/* Rendihind + Müügihind */}
          <View style={styles.row}>
            <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.rowLabel}>Rendihind:</Text>
              <TextInput
                nativeID="add-product-rendihind"
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={rendihind}
                onChangeText={(value) => {
                  setRendihind(value);
                  setFormError(null);
                }}
              />
              <Text style={styles.rowUnit}>€</Text>
            </View>
            <View style={[styles.inputRow, { flex: 1 }]}>
              <Text style={styles.rowLabel}>Müügihind:</Text>
              <TextInput
                nativeID="add-product-muugihind"
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={muugihind}
                onChangeText={(value) => {
                  setMuugihind(value);
                  setFormError(null);
                }}
              />
              <Text style={styles.rowUnit}>€</Text>
            </View>
          </View>

          {/* Saadavus */}
          <AddProductDropdown
            label="Saadavus"
            options={SAADAVUS_OPTIONS}
            value={saadavus}
            onSelect={handleSaadavusSelect}
          />

          <WarehouseAddButton
            onPress={handleCreateProduct}
            disabled={isSubmitting}
            label={isSubmitting ? "Salvestan..." : "Lisa toode"}
          />
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
          {isSubmitting ? (
            <Text style={styles.savingText}>Salvestan toodet...</Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  input: {
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "QuicksandRegular",
  },
  textarea: {
    minHeight: 100,
    paddingTop: 14,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: "#2A2A2A",
  },
  rowLabel: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "QuicksandRegular",
    marginRight: 6,
  },
  rowInput: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "QuicksandRegular",
    padding: 0,
  },
  rowUnit: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "QuicksandRegular",
    marginLeft: 4,
  },
  savingText: {
    color: "#C89B3C",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
  errorText: {
    color: "#E97A7A",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
});
