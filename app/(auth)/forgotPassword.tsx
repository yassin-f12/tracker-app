import { Alert, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { AtIcon } from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email");
      return;
    }
    setIsLoading(true);
    const res = await resetPassword(email.trim().toLowerCase());
    setIsLoading(false);

    if (res.success) {
      Alert.alert(
        "Email envoyé",
        "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } else {
      Alert.alert("Erreur", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={800}>
            Mot de passe
          </Typo>
          <Typo size={30} fontWeight={800}>
            oublié ?
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter} textAlign="center">
            Entrez votre email pour recevoir un lien de réinitialisation
          </Typo>
          <Input
            placeholder="Votre e-mail"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={(value) => setEmail(value.trim().toLowerCase())}
            icon={
              <AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Button
            loading={isLoading}
            onPress={handleSubmit}
            disabled={!email || isLoading}
          >
            <Typo fontWeight={700} color={colors.black} size={21}>
              Envoyer le lien
            </Typo>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._20,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
});
