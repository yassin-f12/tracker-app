import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { ScreenWrapperProps } from "@/types";
import { colors } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          {
            paddingTop: insets.top,
            flex: 1,
            backgroundColor: colors.neutral900,
          },
          style,
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.neutral900}
        />
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
