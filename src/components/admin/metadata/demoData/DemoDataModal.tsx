import React, { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { createDemoData } from "./demoData";

export function DemoDataModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      await createDemoData();
      setDone(true);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        onClose();
        setDone(false);
      }, 600); // Näita "lisatud" teadet 0.6 sek
    } catch (e: any) {
      setError(e?.message || "Tekkis viga!");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.72)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 560,
          backgroundColor: "#101010",
          borderWidth: 1,
          borderColor: "#3A2B12",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 12,
          position: "relative",
        }}
      >
        <Text
          style={{
            color: "#F6E7C1",
            fontSize: 22,
            fontFamily: "QuicksandBold",
            marginBottom: 8,
            marginTop: 8,
          }}
        >
          Lisa demoandmed
        </Text>
        <Text
          style={{
            color: "#AFA089",
            fontSize: 12,
            fontFamily: "QuicksandRegular",
            marginBottom: 16,
          }}
        >
          See lisab 4 klienti, 7 toodet ja 7 erineva staatusega tellimust.
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#C89B3C" />
        ) : done ? (
          <Text style={{ color: "#4CAF50", marginBottom: 8 }}>
            Demoandmed lisatud!
          </Text>
        ) : error ? (
          <Text style={{ color: "#FF5252", marginBottom: 8 }}>{error}</Text>
        ) : null}
        <View style={{ marginTop: 8, gap: 16 }}>
          <Button
            title="Lisa demoandmed"
            onPress={handleCreate}
            disabled={loading}
            color="#C89B3C"
          />
          <Button
            title="Katkesta"
            onPress={onClose}
            color="#AFA089"
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
}
