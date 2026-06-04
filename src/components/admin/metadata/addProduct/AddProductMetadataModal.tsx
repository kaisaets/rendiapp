import { AddProductDropdown } from "@/src/components/admin/warehouse/AddProductDropdown";
import { AddProductPhotoUpload } from "@/src/components/admin/warehouse/AddProductPhotoUpload";
import { WarehouseAddButton } from "@/src/components/admin/warehouse/WarehouseAddButton";
import { ApiError } from "@/src/lib/api/http";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { createMetadataProduct } from "./api";
import {
    INITIAL_FORM_VALUES,
    MATERJAL_OPTIONS,
    RONGAS_OPTIONS,
    SAADAVUS_OPTIONS,
    TUUP_OPTIONS,
} from "./options";
import type {
    AddProductFormValues,
    AddProductImagePayload,
    MaterialValue,
    RingTypeValue,
    StaatusValue,
    TuupValue,
} from "./types";

interface AddProductMetadataModalProps {
  visible: boolean;
  onClose: () => void;
}

const MATERIAL_SET = new Set(MATERJAL_OPTIONS);
const TUUP_SET = new Set(TUUP_OPTIONS);
const RONGAS_SET = new Set(RONGAS_OPTIONS);
const SAADAVUS_SET = new Set(SAADAVUS_OPTIONS);

export function AddProductMetadataModal({
  visible,
  onClose,
}: AddProductMetadataModalProps) {
  const [values, setValues] =
    useState<AddProductFormValues>(INITIAL_FORM_VALUES);
  const [image, setImage] = useState<AddProductImagePayload>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function getMissingFields() {
    const missing: string[] = [];

    if (!image.base64) missing.push("pilt");
    if (!values.nimi.trim()) missing.push("toote nimi");
    if (!values.suurus.trim()) missing.push("suurus");
    if (!values.paksus.trim()) missing.push("paksus");
    if (!values.materjal) missing.push("materjal");
    if (!values.tuup) missing.push("tüüp");
    if (!values.rongas) missing.push("rõngas");
    if (!values.kirjeldus.trim()) missing.push("kirjeldus");
    if (!values.rendihind.trim()) missing.push("rendihind");
    if (!values.muugihind.trim()) missing.push("müügihind");
    if (!values.saadavus) missing.push("saadavus");

    return missing;
  }

  function updateField<K extends keyof AddProductFormValues>(
    key: K,
    value: AddProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFormError(null);
  }

  function pickPhotoOnWeb() {
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
        const base64 = dataUrl.includes(",")
          ? dataUrl.split(",").pop()
          : dataUrl;

        setImage({
          uri: dataUrl,
          base64: base64 || undefined,
          mimeType: file.type || undefined,
          originalName: file.name || undefined,
        });
        setFormError(null);
      };
      reader.readAsDataURL(file);
    };

    input.click();
  }

  function handleSelectMaterial(value: string) {
    if (!value) {
      updateField("materjal", "");
      return;
    }
    if (MATERIAL_SET.has(value as MaterialValue)) {
      updateField("materjal", value as MaterialValue);
    }
  }

  function handleSelectTuup(value: string) {
    if (!value) {
      updateField("tuup", "");
      return;
    }
    if (TUUP_SET.has(value as TuupValue)) {
      updateField("tuup", value as TuupValue);
    }
  }

  function handleSelectRongas(value: string) {
    if (!value) {
      updateField("rongas", "");
      return;
    }
    if (RONGAS_SET.has(value as RingTypeValue)) {
      updateField("rongas", value as RingTypeValue);
    }
  }

  function handleSelectSaadavus(value: string) {
    if (!value) {
      updateField("saadavus", "");
      return;
    }
    if (SAADAVUS_SET.has(value as StaatusValue)) {
      updateField("saadavus", value as StaatusValue);
    }
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setFormError(`Puudu: ${missingFields.join(", ")}.`);
      return;
    }

    const suurusValue = Number.parseInt(values.suurus, 10);
    const paksusValue = Number.parseInt(values.paksus, 10);
    const rendihindValue = Number.parseFloat(values.rendihind);
    const muugihindValue = Number.parseFloat(values.muugihind);

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

      await createMetadataProduct({
        nimi: values.nimi.trim(),
        material: values.materjal,
        suurus: suurusValue,
        thickness: paksusValue,
        tuup1: values.tuup,
        ring_type: values.rongas,
        kirjeldus: values.kirjeldus.trim(),
        hind_paev: rendihindValue,
        buyout_price: muugihindValue,
        staatus: values.saadavus,
        image_base64: image.base64,
        image_mime_type: image.mimeType,
        image_original_name: image.originalName,
      });

      setValues(INITIAL_FORM_VALUES);
      setImage({});
      onClose();
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Metadata: Toote lisamine</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Sulge</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AddProductPhotoUpload uri={image.uri} onPress={pickPhotoOnWeb} />

            <TextInput
              style={styles.input}
              placeholder="Toote nimi..."
              placeholderTextColor="#555555"
              value={values.nimi}
              onChangeText={(value) => updateField("nimi", value)}
            />

            <View style={styles.row}>
              <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.rowLabel}>Suurus:</Text>
                <TextInput
                  style={styles.rowInput}
                  placeholder="0"
                  placeholderTextColor="#555555"
                  keyboardType="numeric"
                  value={values.suurus}
                  onChangeText={(value) => updateField("suurus", value)}
                />
                <Text style={styles.rowUnit}>mm</Text>
              </View>
              <View style={[styles.inputRow, { flex: 1 }]}>
                <Text style={styles.rowLabel}>Paksus:</Text>
                <TextInput
                  style={styles.rowInput}
                  placeholder="0"
                  placeholderTextColor="#555555"
                  keyboardType="numeric"
                  value={values.paksus}
                  onChangeText={(value) => updateField("paksus", value)}
                />
                <Text style={styles.rowUnit}>mm</Text>
              </View>
            </View>

            <AddProductDropdown
              label="Materjal"
              options={MATERJAL_OPTIONS}
              value={values.materjal}
              onSelect={handleSelectMaterial}
            />
            <AddProductDropdown
              label="Tüüp"
              options={TUUP_OPTIONS}
              value={values.tuup}
              onSelect={handleSelectTuup}
            />
            <AddProductDropdown
              label="Rõngas"
              options={RONGAS_OPTIONS}
              value={values.rongas}
              onSelect={handleSelectRongas}
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Kirjeldus"
              placeholderTextColor="#555555"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={values.kirjeldus}
              onChangeText={(value) => updateField("kirjeldus", value)}
            />

            <View style={styles.row}>
              <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.rowLabel}>Rendihind:</Text>
                <TextInput
                  style={styles.rowInput}
                  placeholder="0"
                  placeholderTextColor="#555555"
                  keyboardType="numeric"
                  value={values.rendihind}
                  onChangeText={(value) => updateField("rendihind", value)}
                />
                <Text style={styles.rowUnit}>€</Text>
              </View>
              <View style={[styles.inputRow, { flex: 1 }]}>
                <Text style={styles.rowLabel}>Müügihind:</Text>
                <TextInput
                  style={styles.rowInput}
                  placeholder="0"
                  placeholderTextColor="#555555"
                  keyboardType="numeric"
                  value={values.muugihind}
                  onChangeText={(value) => updateField("muugihind", value)}
                />
                <Text style={styles.rowUnit}>€</Text>
              </View>
            </View>

            <AddProductDropdown
              label="Saadavus"
              options={SAADAVUS_OPTIONS}
              value={values.saadavus}
              onSelect={handleSelectSaadavus}
            />

            <WarehouseAddButton
              onPress={handleSubmit}
              disabled={isSubmitting}
              label={isSubmitting ? "Salvestan..." : "Lisa toode"}
            />

            {formError ? (
              <Text style={styles.errorText}>{formError}</Text>
            ) : null}
            {isSubmitting ? (
              <Text style={styles.savingText}>Salvestan toodet...</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.74)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "88%",
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#3A2B12",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  title: {
    color: "#F6E7C1",
    fontSize: 18,
    fontFamily: "QuicksandBold",
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#5A4320",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 11,
    backgroundColor: "#18120A",
  },
  closeText: {
    color: "#E8C98A",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
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
  errorText: {
    color: "#E97A7A",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
  savingText: {
    color: "#C89B3C",
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    fontFamily: "QuicksandMedium",
  },
});
