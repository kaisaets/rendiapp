import GBstyles from "@/src/theme/global";
import { Text, View } from "react-native";

export function ClientsHeader() {
  return (
    <View style={GBstyles.headerContainer}>
      <Text style={GBstyles.headerText}>KLIENDID</Text>
    </View>
  );
}
