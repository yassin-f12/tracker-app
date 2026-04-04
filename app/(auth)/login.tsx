import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import Input from "@/components/Input";
import { LockIcon, AtIcon } from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth(); 

  const handleSubmit = async () => {
    if(!email || !password) {
      Alert.alert('Se connecter', "Les champs sont vides")
      return
    }
    setIsLoading(true);
    const res = await loginUser(email.trim().toLowerCase(), password);
    setIsLoading(false);
    if(!res.success) {
      Alert.alert("connexion :", res.msg);
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={800}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={800}>
            Bon retour
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter} textAlign={"center"}>
            Connectez-vous maintenant pour suivre toutes vos dépenses
          </Typo>
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

          <Typo size={14} color={colors.text} style={{ alignSelf: 'flex-end' }}>
            Mot de passe oublié ?
          </Typo>

          <Button loading={isLoading} onPress={handleSubmit} disabled={!email || !password || isLoading}>
            <Typo fontWeight={700} color={colors.black} size={21}>
              Se connecter
            </Typo>
          </Button>
        </View>

        <View style={styles.footer}>
          <Typo size={15}>Vous n'avez pas encore de compte ?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={700} color={colors.primary}>Créer mon compte</Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
