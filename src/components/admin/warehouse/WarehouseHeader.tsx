import GBstyle from "@/src/theme/global";
import { Text, View } from "react-native";

interface WarehouseHeaderProps {
  activeView: "laoseis" | "liikumine";
  onViewChange: (view: "laoseis" | "liikumine") => void;
}

export function WarehouseHeader({
  activeView,
  onViewChange,
}: WarehouseHeaderProps) {
  return (
    <View style={GBstyle.BannerContainer}>
      <Text style={GBstyle.headerText}>Laoseis</Text>
    </View>
  );
}
