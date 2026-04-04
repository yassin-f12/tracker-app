import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const isIos = Platform.OS === "ios";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={isIos ? "padding" : "height"}
        style={[styles.container, { backgroundColor: bg }, style]}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
