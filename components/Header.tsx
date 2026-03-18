import { StyleSheet, View } from "react-native";
import Typo from "./Typo";
import { HeaderProps } from "@/types";
import { spacingY } from "@/constants/theme";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={600}
          textAlign="center"
          style={{ width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: spacingY._10
  },
  leftIcon: {
    alignSelf: "flex-start",
  },
});
