import { StyleSheet } from "react-native";

const GBstyles = StyleSheet.create({
  BannerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#C89B3C",
    marginTop: 16,
    marginBottom: 16,
    height: 64,
    display: "flex",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#000",
    fontFamily: "QuicksandSemiBold",
    textTransform: "uppercase",
  },
});

export default GBstyles;
