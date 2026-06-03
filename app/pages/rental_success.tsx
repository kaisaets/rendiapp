import {
    Quicksand_500Medium,
    Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function RentalSuccess() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="check-circle"
          size={88}
          color="#C89B3C"
          style={styles.icon}
        />
        <Text style={styles.title}>TÄNAME TELLIMUSE EEST</Text>
        <Text style={styles.subtitle}>OLEME TÄNULIKUD, ET VALISITE FAGER SUULISED</Text>
        <Pressable style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>TAGASI AVALEHELE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    color: "#F5F5F5",
    fontSize: 24,
    fontFamily: "Quicksand_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#B5B5B5",
    fontSize: 18,
    fontFamily: "Quicksand_500Medium",
    textAlign: "center",
    lineHeight: 26,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#C89B3C",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 18,
  },
  buttonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontFamily: "Quicksand_500Medium",
  },
});
