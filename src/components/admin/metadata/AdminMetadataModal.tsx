import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface MetadataAction {
  id: string;
  title: string;
  description: string;
}

const ACTIONS: MetadataAction[] = [
  {
    id: "add-product",
    title: "Toote lisamine",
    description: "Kiirvorm toodete testandmete lisamiseks.",
  },
  {
    id: "add-client",
    title: "Kliendi lisamine",
    description: "Loo testklient ühe klõpsuga.",
  },
  {
    id: "simulate-order",
    title: "Tellimuse lisamine",
    description: "Loo testtellimus otse andmebaasi.",
  },
  {
    id: "delete-all-data",
    title: "Kustuta kõik andmed",
    description: "Kustutab kõik kliendid, tooted ja tellimused andmebaasist.",
  },
  {
    id: "seed-data",
    title: "Demoandmed",
    description: "Lae testimiseks eelseadistatud demoandmed.",
  },
];

interface AdminMetadataModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAddProduct: () => void;
  onOpenAddClient: () => void;
  onOpenAddOrder: () => void;
  onOpenDemoData: () => void;
  onOpenDeleteAllData: () => void;
}

export function AdminMetadataModal({
  visible,
  onClose,
  onOpenAddProduct,
  onOpenAddClient,
  onOpenAddOrder,
  onOpenDemoData,
  onOpenDeleteAllData,
}: AdminMetadataModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />

        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Admin Metadata</Text>
              <Text style={styles.subtitle}>
                Kiired testtoimingud ja simulatsioonid
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Sulge</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={styles.item}
                onPress={() => {
                  if (action.id === "add-product") {
                    onClose();
                    onOpenAddProduct();
                    return;
                  }
                  if (action.id === "add-client") {
                    onClose();
                    onOpenAddClient();
                    return;
                  }
                  if (action.id === "simulate-order") {
                    onClose();
                    onOpenAddOrder();
                    return;
                  }
                  if (action.id === "delete-all-data") {
                    onClose();
                    onOpenDeleteAllData();
                    return;
                  }
                  if (action.id === "seed-data") {
                    onClose();
                    onOpenDemoData();
                    return;
                  }
                }}
              >
                <Text style={styles.itemTitle}>{action.title}</Text>
                <Text style={styles.itemDescription}>{action.description}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.footnote}>Kasutusel testimiseks.</Text>
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
    maxHeight: "82%",
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#3A2B12",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: "#F6E7C1",
    fontSize: 22,
    fontFamily: "QuicksandBold",
  },
  subtitle: {
    color: "#AFA089",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "QuicksandRegular",
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
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: 8,
    gap: 10,
  },
  item: {
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2B2B2B",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "QuicksandSemiBold",
    marginBottom: 4,
  },
  itemDescription: {
    color: "#9A9A9A",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "QuicksandRegular",
  },
  footnote: {
    marginTop: 8,
    color: "#7F7F7F",
    fontSize: 11,
    fontFamily: "QuicksandRegular",
  },
});
