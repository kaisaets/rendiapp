import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AddProductPhotoUploadProps {
  uri?: string;
  onPress: () => void;
}

export function AddProductPhotoUpload({
  uri,
  onPress,
}: AddProductPhotoUploadProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={32}
            color="#555555"
          />
          <Text style={styles.label}>ADD PHOTO</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    height: 160,
    overflow: "hidden",
    backgroundColor: "#111111",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#555555",
    letterSpacing: 1.5,
    fontFamily: "QuicksandMedium",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
