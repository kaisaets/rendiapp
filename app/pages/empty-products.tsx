import {
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function EmptyProducts() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Ionicons
          name="bag-outline"
          size={80}
          color="#CC9D36"
          style={styles.icon}
        />
        <Text style={styles.title}>Tootet ei leitud</Text>
        <Text style={styles.subtitle}>
          Hetkel pole tooted saadaval. Palun kontrollige hiljem uuesti.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => router.replace({ pathname: "/" })}
        >
          <Text style={styles.buttonText}>Tagasi avalehele</Text>
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
    gap: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    color: "#F5F5F5",
    fontSize: 24,
    fontFamily: "Quicksand_700Bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#B5B5B5",
    fontSize: 16,
    fontFamily: "Quicksand_400Regular",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#CC9D36",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: "#0A0A0A",
    fontSize: 14,
    fontFamily: "Quicksand_500Medium",
    fontWeight: "600",
  },
});
