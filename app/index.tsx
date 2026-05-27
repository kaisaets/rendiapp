import { Text, View } from "react-native";
import React, { useState } from "react";
import Navbar from "../src/components/Navbar";

export default function Index() {
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}
