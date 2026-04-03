import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

const isIos = Platform.OS === "ios";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bg }, style]}
      behavior={isIos ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._15 : 20,
    paddingBottom: isIos ? spacingY._20 : spacingY._10,
  },
});
