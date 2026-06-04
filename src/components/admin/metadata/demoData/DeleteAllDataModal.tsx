import React, { useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { deleteAllData } from "./deleteAllData";

export function DeleteAllDataModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setDone(false);
    try {
      await deleteAllData();
      setDone(true);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        onClose();
        setDone(false);
      }, 600);
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
          maxWidth: 480,
          backgroundColor: "#101010",
          borderWidth: 1,
          borderColor: "#3A2B12",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 16,
          position: "relative",
        }}
      >
        <Text
          style={{
            color: "#F6E7C1",
            fontSize: 20,
            fontFamily: "QuicksandBold",
            marginBottom: 10,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Kustuta kõik andmed
        </Text>
        <Text
          style={{
            color: "#AFA089",
            fontSize: 13,
            fontFamily: "QuicksandRegular",
            marginBottom: 18,
            textAlign: "center",
          }}
        >
          Oled kindel, et soovid kõik kliendid, tooted ja tellimused
          andmebaasist kustutada? Seda tegevust ei saa tagasi võtta!
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#C89B3C" />
        ) : done ? (
          <Text
            style={{ color: "#4CAF50", marginBottom: 8, textAlign: "center" }}
          >
            Kõik andmed kustutatud!
          </Text>
        ) : error ? (
          <Text
            style={{ color: "#FF5252", marginBottom: 8, textAlign: "center" }}
          >
            {error}
          </Text>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 16,
            marginTop: 8,
          }}
        >
          <Button
            title="Katkesta"
            onPress={onClose}
            color="#AFA089"
            disabled={loading}
          />
          <Button
            title="Kustuta kõik"
            onPress={handleDelete}
            color="#C89B3C"
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
}
