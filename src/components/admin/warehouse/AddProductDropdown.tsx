import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AddProductDropdownProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

export function AddProductDropdown({
  label,
  options,
  value,
  onSelect,
}: AddProductDropdownProps) {
  const [open, setOpen] = useState(false);

  const blurWebActiveElement = () => {
    if (Platform.OS !== "web") {
      return;
    }

    const active = document.activeElement;
    if (active && "blur" in active) {
      (active as HTMLElement).blur();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        onPress={() => {
          blurWebActiveElement();
          setOpen(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.fieldText, !value && styles.placeholder]}>
          {value || label}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color="#555555" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => {
            blurWebActiveElement();
            setOpen(false);
          }}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.option}
                  onPress={() => {
                    onSelect(opt);
                    blurWebActiveElement();
                    setOpen(false);
                  }}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === opt && styles.optionActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {value === opt && (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color="#CC9D36"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "QuicksandRegular",
  },
  placeholder: {
    color: "#555555",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: "50%",
  },
  sheetTitle: {
    fontSize: 13,
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontFamily: "QuicksandSemiBold",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#CCCCCC",
    fontFamily: "QuicksandMedium",
  },
  optionActive: {
    color: "#CC9D36",
    fontFamily: "QuicksandBold",
  },
});
