import { AdminMetadataModal } from "@/src/components/admin/metadata/AdminMetadataModal";
import { AddClientMetadataModal } from "@/src/components/admin/metadata/addClient/AddClientMetadataModal";
import { AddProductMetadataModal } from "@/src/components/admin/metadata/addProduct/AddProductMetadataModal";
import { DemoDataModal } from "@/src/components/admin/metadata/demoData";
import { DeleteAllDataModal } from "@/src/components/admin/metadata/demoData/DeleteAllDataModal";
import { AddOrderMetadataModal } from "@/src/components/admin/metadata/orders/AddOrderMetadataModal";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function AdminMetadataLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isDemoDataOpen, setIsDemoDataOpen] = useState(false);
  const [isDeleteAllDataOpen, setIsDeleteAllDataOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>ADMIN metaData</Text>
      </Pressable>

      <AdminMetadataModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
        onOpenAddClient={() => setIsAddClientOpen(true)}
        onOpenAddOrder={() => setIsAddOrderOpen(true)}
        onOpenDemoData={() => setIsDemoDataOpen(true)}
        onOpenDeleteAllData={() => setIsDeleteAllDataOpen(true)}
      />
      <DeleteAllDataModal
        visible={isDeleteAllDataOpen}
        onClose={() => setIsDeleteAllDataOpen(false)}
      />
      <DemoDataModal
        visible={isDemoDataOpen}
        onClose={() => setIsDemoDataOpen(false)}
      />

      <AddProductMetadataModal
        visible={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      <AddClientMetadataModal
        visible={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <AddOrderMetadataModal
        visible={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 16,
    right: 14,
    zIndex: 50,
    borderWidth: 1,
    borderColor: "#5A4320",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "rgba(16, 12, 8, 0.92)",
  },
  buttonText: {
    color: "#F2D7A0",
    fontSize: 11,
    letterSpacing: 0.7,
    fontFamily: "QuicksandBold",
  },
});
