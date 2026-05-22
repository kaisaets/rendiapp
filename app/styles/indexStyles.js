import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  pealkiri: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  kaart: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  viimaneKaart: {
    marginBottom: 40,
  },
  sektsiooniPealkiri: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  sisend: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  sisendMultiline: {
    height: 72,
    textAlignVertical: "top",
  },
  nupp: {
    backgroundColor: "#4a90d9",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  nuppTekst: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  tühi: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 14,
  },

  // Kirje kaart loendis
  kaardirida: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  kaardirida_päis: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f4fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ridaNimi: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },

  // Väljad grid (2 veergu)
  väljadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 6,
  },
  väljaPool: {
    width: "48%",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 8,
  },
  väljaTäis: {
    width: "100%",
    backgroundColor: "#fafafa",
    borderRadius: 6,
    padding: 8,
  },
  väljaSilt: {
    fontSize: 10,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  väljaVäärtus: {
    fontSize: 13,
    color: "#333",
  },

  // Staatuse värvid
  saadaval: {
    fontSize: 13,
    color: "#2e7d32",
    fontWeight: "600",
  },
  renditud: {
    fontSize: 13,
    color: "#c62828",
    fontWeight: "600",
  },
  roll: {
    fontSize: 13,
    color: "#7b1fa2",
    fontWeight: "600",
  },

  kustutaNupp: {
    backgroundColor: "#ffebee",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  kustutaTekst: {
    color: "#c62828",
    fontSize: 12,
    fontWeight: "500",
  },
  valikSilt: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    marginTop: 2,
  },
  valikRida: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  valikNupp: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#fafafa",
  },
  valikNuppAktiivne: {
    borderColor: "#4a90d9",
    backgroundColor: "#e8f0fb",
  },
  valikNuppTekst: {
    fontSize: 13,
    color: "#555",
  },
  valikNuppTekstAktiivne: {
    color: "#4a90d9",
    fontWeight: "600",
  },

  veaTeade: {
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  veaTekst: {
    color: "#c62828",
    fontSize: 13,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  kasutajaEmailTekst: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  logoutNupp: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  logoutNuppTekst: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  // Veebis hoiatus
  webHoiatus: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f5f5f5",
  },
  webHoiatusIkoon: {
    fontSize: 64,
    marginBottom: 16,
  },
  webHoiatusPealkiri: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  webHoiatusTekst: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  webHoiatusKood: {
    fontFamily: "monospace",
    backgroundColor: "#1a1a1a",
    color: "#4fc3f7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 13,
  },
});

export default styles;
