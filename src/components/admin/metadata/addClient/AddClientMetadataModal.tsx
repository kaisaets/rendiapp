import { ApiError } from "@/src/lib/api/http";
import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { createMetadataClient } from "./api";
import { emitKasutajadChanged } from "./events";

interface AddClientMetadataModalProps {
  visible: boolean;
  onClose: () => void;
}

const INITIAL_VALUES = {
  nimi: "",
  email: "",
  telefon: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function AddClientMetadataModal({
  visible,
  onClose,
}: AddClientMetadataModalProps) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
    onClose();
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const nimi = values.nimi.trim();
    const email = values.email.trim().toLowerCase();
    const telefon = values.telefon.trim();

    if (!email) {
      setFormError("Email on kohustuslik.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Sisesta korrektne emaili aadress.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      await createMetadataClient({
        email,
        nimi: nimi || null,
        telefon: telefon || null,
      });

      emitKasutajadChanged();
      setValues(INITIAL_VALUES);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message || "Kliendi lisamine ebaonnestus.");
      } else {
        setFormError("Kliendi lisamine ebaonnestus.");
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
            <Text style={styles.title}>Metadata: Kliendi lisamine</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Sulge</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Kliendi nimi (valikuline)"
            placeholderTextColor="#555555"
            value={values.nimi}
            onChangeText={(value) => updateField("nimi", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email*"
            placeholderTextColor="#555555"
            autoCapitalize="none"
            keyboardType="email-address"
            value={values.email}
            onChangeText={(value) => updateField("email", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Telefon (valikuline)"
            placeholderTextColor="#555555"
            keyboardType="phone-pad"
            value={values.telefon}
            onChangeText={(value) => updateField("telefon", value)}
          />

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
              {isSubmitting ? "Lisan..." : "Lisa klient"}
            </Text>
          </Pressable>
        </View>
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
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#3A2B12",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    gap: 10,
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
