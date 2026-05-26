import { StyleSheet, Text, TextInput } from "react-native";

export const FONT_FAMILY_REGULAR = "QuicksandRegular";
export const FONT_FAMILY_BOLD = "QuicksandBold";

let isApplied = false;

export function applyGlobalTypography() {
  if (isApplied) {
    return;
  }

  isApplied = true;

  const GlobalText = Text as typeof Text & {
    defaultProps?: Record<string, unknown>;
  };
  const GlobalTextInput = TextInput as typeof TextInput & {
    defaultProps?: Record<string, unknown>;
  };

  const textDefaults = GlobalText.defaultProps ?? {};
  GlobalText.defaultProps = {
    ...textDefaults,
    style: [
      StyleSheet.flatten(textDefaults.style),
      { fontFamily: FONT_FAMILY_REGULAR },
    ],
  };

  const textInputDefaults = GlobalTextInput.defaultProps ?? {};
  GlobalTextInput.defaultProps = {
    ...textInputDefaults,
    style: [
      StyleSheet.flatten(textInputDefaults.style),
      { fontFamily: FONT_FAMILY_REGULAR },
    ],
  };
}
