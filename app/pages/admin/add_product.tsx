import { AddProductDropdown } from "@/src/components/admin/warehouse/AddProductDropdown";
import { AddProductHeader } from "@/src/components/admin/warehouse/AddProductHeader";
import { AddProductPhotoUpload } from "@/src/components/admin/warehouse/AddProductPhotoUpload";
import { WarehouseAddButton } from "@/src/components/admin/warehouse/WarehouseAddButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const MATERJAL_OPTIONS = ["Raud", "Teras", "Titaan", "Kroom-molübdeen"];
const TUUP_OPTIONS = [
  "Loose ring",
  "Fixed ring",
  "Eggbutt",
  "Full cheek",
  "D-ring",
];
const RONGAS_OPTIONS = ["Üksik rõngas", "Topeltrõngas", "Lülirõngas"];
const SAADAVUS_OPTIONS = ["Saadaval", "Tellitav"];

export default function AddProductPage() {
  const router = useRouter();

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [nimi, setNimi] = useState("");
  const [suurus, setSuurus] = useState("");
  const [paksus, setPaksus] = useState("");
  const [materjal, setMaterjal] = useState("");
  const [tuup, setTuup] = useState("");
  const [rongas, setRongas] = useState("");
  const [kirjeldus, setKirjeldus] = useState("");
  const [rendihind, setRendihind] = useState("");
  const [muugihind, setMuugihind] = useState("");
  const [saadavus, setSaadavus] = useState("");

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
          <AddProductPhotoUpload uri={photoUri} onPress={() => {}} />

          {/* Toote nimi */}
          <TextInput
            style={styles.input}
            placeholder="Toote nimi..."
            placeholderTextColor="#555555"
            value={nimi}
            onChangeText={setNimi}
          />

          {/* Suurus + Paksus */}
          <View style={styles.row}>
            <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.rowLabel}>Suurus:</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={suurus}
                onChangeText={setSuurus}
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
                value={paksus}
                onChangeText={setPaksus}
              />
              <Text style={styles.rowUnit}>mm</Text>
            </View>
          </View>

          {/* Dropdowns */}
          <AddProductDropdown
            label="Materjal"
            options={MATERJAL_OPTIONS}
            value={materjal}
            onSelect={setMaterjal}
          />
          <AddProductDropdown
            label="Tüüp"
            options={TUUP_OPTIONS}
            value={tuup}
            onSelect={setTuup}
          />
          <AddProductDropdown
            label="Rõngas"
            options={RONGAS_OPTIONS}
            value={rongas}
            onSelect={setRongas}
          />

          {/* Kirjeldus */}
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Kirjeldus"
            placeholderTextColor="#555555"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={kirjeldus}
            onChangeText={setKirjeldus}
          />

          {/* Rendihind + Müügihind */}
          <View style={styles.row}>
            <View style={[styles.inputRow, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.rowLabel}>Rendihind:</Text>
              <TextInput
                style={styles.rowInput}
                placeholder="0"
                placeholderTextColor="#555555"
                keyboardType="numeric"
                value={rendihind}
                onChangeText={setRendihind}
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
                value={muugihind}
                onChangeText={setMuugihind}
              />
              <Text style={styles.rowUnit}>€</Text>
            </View>
          </View>

          {/* Saadavus */}
          <AddProductDropdown
            label="Saadavus"
            options={SAADAVUS_OPTIONS}
            value={saadavus}
            onSelect={setSaadavus}
          />

          <WarehouseAddButton onPress={() => {}} />
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
});
