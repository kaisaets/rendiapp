import { AddProductDropdown } from "@/src/components/admin/warehouse/AddProductDropdown";
import { getKasutajad } from "@/src/features/kasutajad/api";
import { getSuulised } from "@/src/features/suulised/api";
import { ApiError } from "@/src/lib/api/http";
import type { Kasutaja, Suuline } from "@/src/lib/api/types";
import { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { createMetadataOrder } from "./api";
import { emitRentimisedChanged } from "./events";

interface AddOrderMetadataModalProps {
  visible: boolean;
  onClose: () => void;
}

type DateFieldKey = "algusKuupaev" | "loppKuupaev";

const INITIAL_VALUES = {
  kasutajaOption: "",
  suulineOption: "",
  algusKuupaev: "",
  loppKuupaev: "",
  staatus: "",
  totalPrice: "",
  paid: "",
};

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!isIsoDate(value)) {
    return "";
  }

  const date = fromIsoDate(value);
  return date.toLocaleDateString("et-EE");
}

function fromIsoDate(value: string) {
  if (!isIsoDate(value)) {
    return new Date();
  }

  const [year, month, day] = value.split("-").map((part) => Number(part));
  return new Date(year, month - 1, day);
}

export function AddOrderMetadataModal({
  visible,
  onClose,
}: AddOrderMetadataModalProps) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [kasutajad, setKasutajad] = useState<Kasutaja[]>([]);
  const [suulised, setSuulised] = useState<Suuline[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(
    null,
  );
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const kasutajaOptions = useMemo(
    () =>
      kasutajad.map((kasutaja) => {
        const name = kasutaja.nimi?.trim() || kasutaja.email;
        return `#${kasutaja.id} - ${name}`;
      }),
    [kasutajad],
  );

  const suulineOptions = useMemo(
    () =>
      suulised.map((suuline) => {
        return `#${suuline.id} - ${suuline.nimi}`;
      }),
    [suulised],
  );

  const kasutajaIdByOption = useMemo(() => {
    const mapping = new Map<string, number>();
    kasutajaOptions.forEach((option, index) => {
      mapping.set(option, kasutajad[index].id);
    });
    return mapping;
  }, [kasutajaOptions, kasutajad]);

  const suulineIdByOption = useMemo(() => {
    const mapping = new Map<string, number>();
    suulineOptions.forEach((option, index) => {
      mapping.set(option, suulised[index].id);
    });
    return mapping;
  }, [suulineOptions, suulised]);

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      if (!visible) {
        return;
      }

      try {
        setLoadingOptions(true);
        const [kasutajadData, suulisedData] = await Promise.all([
          getKasutajad(),
          getSuulised(),
        ]);

        if (!isMounted) {
          return;
        }

        setKasutajad(kasutajadData);
        setSuulised(suulisedData);
        setOptionsError(null);
      } catch {
        if (!isMounted) {
          return;
        }

        setOptionsError("Kasutajate ja toodete laadimine ebaõnnestus.");
      } finally {
        if (isMounted) {
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [visible]);

  function updateField(key: keyof typeof INITIAL_VALUES, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFormError(null);
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setValues(INITIAL_VALUES);
    setFormError(null);
    setActiveDateField(null);
    onClose();
  }

  function openDatePicker(field: DateFieldKey) {
    setFormError(null);
    setCalendarMonth(fromIsoDate(values[field] || toIsoDate(new Date())));
    setActiveDateField(field);
  }

  function closeDatePicker() {
    setActiveDateField(null);
  }

  function handlePickDate(date: Date) {
    if (!activeDateField) {
      return;
    }

    updateField(activeDateField, toIsoDate(date));
    closeDatePicker();
  }

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const leadingEmpty = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result: Array<Date | null> = [];

    for (let i = 0; i < leadingEmpty; i += 1) {
      result.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      result.push(new Date(year, month, day));
    }

    return result;
  }, [calendarMonth]);

  const selectedIso = activeDateField ? values[activeDateField] : "";

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const kasutajaId = kasutajaIdByOption.get(values.kasutajaOption);
    const suulineId = suulineIdByOption.get(values.suulineOption);
    const algusKuupaev = values.algusKuupaev.trim();
    const loppKuupaev = values.loppKuupaev.trim();
    const staatus = values.staatus.trim();
    const totalPrice = values.totalPrice.trim();
    const paid = values.paid.trim().toLowerCase();

    if (!kasutajaId) {
      setFormError("Vali olemasolev kasutaja.");
      return;
    }

    if (!suulineId) {
      setFormError("Vali olemasolev toode.");
      return;
    }

    if (!algusKuupaev || !isIsoDate(algusKuupaev)) {
      setFormError("Alguskuupäev peab olema formaadis YYYY-MM-DD.");
      return;
    }

    if (loppKuupaev && !isIsoDate(loppKuupaev)) {
      setFormError("Lõppkuupäev peab olema formaadis YYYY-MM-DD.");
      return;
    }

    const parsedTotal = totalPrice ? Number.parseFloat(totalPrice) : null;
    if (totalPrice && Number.isNaN(parsedTotal)) {
      setFormError("Arve kokku peab olema number.");
      return;
    }

    const paidValue =
      paid === ""
        ? null
        : paid === "true" || paid === "1" || paid === "jah"
          ? true
          : paid === "false" || paid === "0" || paid === "ei"
            ? false
            : undefined;

    if (paidValue === undefined) {
      setFormError("Paid väli: kasuta true/false, jah/ei või 1/0.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      await createMetadataOrder({
        kasutaja_id: kasutajaId,
        suuline_id: suulineId,
        algus_kuupaev: algusKuupaev,
        lopp_kuupaev: loppKuupaev || null,
        staatus: staatus || null,
        total_price: parsedTotal,
        paid: paidValue,
      });

      emitRentimisedChanged();
      setValues(INITIAL_VALUES);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message || "Tellimuse lisamine ebaõnnestus.");
      } else {
        setFormError("Tellimuse lisamine ebaõnnestus.");
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
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />

        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Metadata: Tellimuse lisamine</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Sulge</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AddProductDropdown
              label={loadingOptions ? "Laen kasutajaid..." : "Vali kasutaja*"}
              options={kasutajaOptions}
              value={values.kasutajaOption}
              onSelect={(value) => updateField("kasutajaOption", value)}
            />

            <AddProductDropdown
              label={loadingOptions ? "Laen tooteid..." : "Vali toode*"}
              options={suulineOptions}
              value={values.suulineOption}
              onSelect={(value) => updateField("suulineOption", value)}
            />

            <Pressable
              style={styles.dateField}
              onPress={() => openDatePicker("algusKuupaev")}
            >
              <Text
                style={[
                  styles.dateFieldText,
                  !values.algusKuupaev && styles.placeholderText,
                ]}
              >
                {formatDate(values.algusKuupaev) || "Vali alguskuupäev*"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.dateField}
              onPress={() => openDatePicker("loppKuupaev")}
            >
              <Text
                style={[
                  styles.dateFieldText,
                  !values.loppKuupaev && styles.placeholderText,
                ]}
              >
                {formatDate(values.loppKuupaev) || "Vali lõppkuupäev"}
              </Text>
            </Pressable>

            <TextInput
              style={styles.input}
              placeholder="Staatus (valikuline)"
              placeholderTextColor="#555555"
              value={values.staatus}
              onChangeText={(value) => updateField("staatus", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Arve kokku (valikuline)"
              placeholderTextColor="#555555"
              keyboardType="numeric"
              value={values.totalPrice}
              onChangeText={(value) => updateField("totalPrice", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Paid: true/false (valikuline)"
              placeholderTextColor="#555555"
              autoCapitalize="none"
              value={values.paid}
              onChangeText={(value) => updateField("paid", value)}
            />
          </ScrollView>

          {optionsError ? (
            <Text style={styles.errorText}>{optionsError}</Text>
          ) : null}
          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

          <Pressable
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? "Lisan..." : "Lisa tellimus"}
            </Text>
          </Pressable>
        </View>

        {activeDateField ? (
          <View style={styles.calendarOverlay}>
            <Pressable
              style={styles.calendarBackdrop}
              onPress={closeDatePicker}
            />

            <View style={styles.calendarSheet}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>
                  {calendarMonth.toLocaleDateString("et-EE", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>

                <View style={styles.calendarNavRow}>
                  <Pressable
                    style={styles.calendarNavButton}
                    onPress={() =>
                      setCalendarMonth(
                        (prev) =>
                          new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                      )
                    }
                  >
                    <Text style={styles.calendarNavButtonText}>‹</Text>
                  </Pressable>

                  <Pressable
                    style={styles.calendarNavButton}
                    onPress={() =>
                      setCalendarMonth(
                        (prev) =>
                          new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                      )
                    }
                  >
                    <Text style={styles.calendarNavButtonText}>›</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.calendarWeekdays}>
                {["E", "T", "K", "N", "R", "L", "P"].map((label) => (
                  <Text key={label} style={styles.calendarWeekdayText}>
                    {label}
                  </Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return (
                      <View
                        key={`empty-${index}`}
                        style={styles.calendarCell}
                      />
                    );
                  }

                  const iso = toIsoDate(day);
                  const isSelected = iso === selectedIso;

                  return (
                    <Pressable
                      key={iso}
                      style={[
                        styles.calendarCell,
                        isSelected && styles.calendarCellSelected,
                      ]}
                      onPress={() => handlePickDate(day)}
                    >
                      <Text
                        style={[
                          styles.calendarCellText,
                          isSelected && styles.calendarCellTextSelected,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "86%",
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#3A2B12",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 8,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    gap: 10,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    color: "#F6E7C1",
    fontSize: 22,
    fontFamily: "QuicksandBold",
    flex: 1,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#5A4320",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#18120A",
  },
  closeText: {
    color: "#E8C98A",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2E2E2E",
    backgroundColor: "#171717",
    borderRadius: 12,
    color: "#FFFFFF",
    fontFamily: "QuicksandMedium",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dateField: {
    borderWidth: 1,
    borderColor: "#2E2E2E",
    backgroundColor: "#171717",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  dateFieldText: {
    color: "#FFFFFF",
    fontFamily: "QuicksandMedium",
    fontSize: 14,
  },
  placeholderText: {
    color: "#555555",
  },
  calendarOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  calendarBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  calendarSheet: {
    backgroundColor: "#0F0F0F",
    borderTopWidth: 1,
    borderColor: "#8D681B",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 10,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calendarTitle: {
    color: "#F6E7C1",
    fontSize: 18,
    textTransform: "capitalize",
    fontFamily: "QuicksandBold",
  },
  calendarNavRow: {
    flexDirection: "row",
    gap: 8,
  },
  calendarNavButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5A4320",
    backgroundColor: "#18120A",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarNavButtonText: {
    color: "#E8C98A",
    fontSize: 22,
    lineHeight: 22,
    fontFamily: "QuicksandBold",
  },
  calendarWeekdays: {
    flexDirection: "row",
  },
  calendarWeekdayText: {
    flex: 1,
    textAlign: "center",
    color: "#AA8A4C",
    fontSize: 12,
    fontFamily: "QuicksandSemiBold",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: "14.2857%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  calendarCellSelected: {
    backgroundColor: "#B58A45",
  },
  calendarCellText: {
    color: "#D8D8D8",
    fontSize: 14,
    fontFamily: "QuicksandMedium",
  },
  calendarCellTextSelected: {
    color: "#100B03",
    fontFamily: "QuicksandBold",
  },
  errorText: {
    color: "#E97A7A",
    fontSize: 12,
    fontFamily: "QuicksandMedium",
  },
  submitButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B58A45",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#100B03",
    fontSize: 13,
    fontFamily: "QuicksandBold",
  },
});
