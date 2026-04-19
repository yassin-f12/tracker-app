import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

const isIos = Platform.OS === "ios";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? verticalScale(50) : verticalScale(20)}
      style={[styles.container, { backgroundColor: bg }, style]}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isIos ? spacingY._15 : spacingY._10,
    paddingBottom: isIos ? spacingY._20 : spacingY._10,
  },
});
