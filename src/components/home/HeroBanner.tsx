import { FONT_FAMILY_BOLD, FONT_FAMILY_REGULAR } from "@/src/theme/typography";
import { ImageBackground, StyleSheet, View } from "react-native";

export function HeroBanner() {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("@/assets/images/Hero.png")}
        resizeMode="cover"
        style={styles.image}
      >
        {/* <View style={styles.overlay}>
          <Text style={styles.brandTop}>INNOVATIVE</Text>
          <Text style={styles.brandMain}>HORSE CARE</Text>
          <Text style={styles.brandSub}>RENDI | PROOVI | OTSUSTA</Text>
        </View> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderColor: "#3B2A0E",
    backgroundColor: "#070707",
    height: 500,
    width: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: "flex-end",
    minHeight: 285,
    backgroundColor: "rgba(7, 7, 7, 0.68)",
  },
  brandTop: {
    color: "#E2BC6A",
    textAlign: "center",
    fontSize: 13,
    letterSpacing: 4,
    fontFamily: FONT_FAMILY_REGULAR,
  },
  brandMain: {
    marginTop: 4,
    color: "#F9E8B9",
    textAlign: "center",
    fontSize: 29,
    letterSpacing: 2.4,
    fontFamily: FONT_FAMILY_BOLD,
  },
  brandSub: {
    marginTop: 10,
    color: "#D9B872",
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: FONT_FAMILY_REGULAR,
  },
});
