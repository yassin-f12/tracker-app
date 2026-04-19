import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')} 
            style={styles.loginButton}
          >
            <Typo fontWeight={500}>Connexion</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering = {FadeIn.duration(1000)}
            source={require('@/assets/images/welcome.png')}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

          <View style={styles.footer}>
            <Animated.View 
              entering={FadeInDown.duration(1000).springify().damping(40)} 
            >
              <Typo size={28} fontWeight={800} textAlign="center">Prendre le contrôle de ses finances</Typo>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(1000).delay(100).springify().damping(40)}
            >
              <Typo size={17} color={colors.textLight} textAlign="center">Des finances plus claires, une vie plus simple</Typo>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.duration(1000).delay(200).springify().damping(40)} 
              style={styles.buttonContainer}
            >
              <Button
                onPress={() => router.push('/(auth)/register')} 
              >
                <Typo size={22} color={colors.neutral900} fontWeight={600}>Commencer</Typo>
              </Button>
            </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  )
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    paddingHorizontal: scale(20),
    gap: spacingY._25,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 25,
    shadowOpacity: 0.15,
    elevation: Platform.OS === "android" ? 0 : 10,
    borderTopWidth: Platform.OS === "android" ? 1 : 0,
    borderTopColor: colors.neutral700,       
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
