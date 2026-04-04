import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { LockIcon, AtIcon, UserIcon } from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password || !name) {
      Alert.alert("Mon compte", "Les champs sont vides");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(email.trim().toLowerCase(), password, name);
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("s'enregistrer", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={800}>
            C'est partie !
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter} textAlign={"center"}>
            Créez votre compte maintenant pour suivre toutes vos dépenses
          </Typo>
          <Input
            placeholder="Votre pseudo"
            value={name}
            returnKeyType="next"
            onChangeText={setName}
            icon={
              <UserIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            placeholder="Votre e-mail"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onChangeText={(value) => setEmail(value.trim().toLowerCase())}
            icon={
              <AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            placeholder="Votre mot de passe"
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={setPassword}
            icon={
              <LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button
            loading={isLoading}
            onPress={handleSubmit}
            disabled={!email || !password || !name || isLoading}
          >
            <Typo fontWeight={700} color={colors.black} size={21}>
              Créer mon compte
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Vous avez déjà un compte ?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={700} color={colors.primary}>
              Se connecter
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._20,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: 500,
    color: colors.text,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
