import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { getFirebaseAuthErrorMessage } from "@/config/firebaseErrors";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/service/imageService";
import { updateUser } from "@/service/userService";
import { UserDataType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { PencilIcon } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileModal = () => {
  const { user, updateUserData, updateUserEmail } = useAuth();

  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    email: "",
    image: null,
  });
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      image: user?.image || null,
    });
  }, [user]);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    const { name, email } = userData;

    if (!name.trim() || !email.trim()) {
      Alert.alert("Utilisateur", "Veuillez remplir tous les champs !");
      return;
    }
    if (!user?.uid) return;

    const emailChanged = email !== user.email;

    if (emailChanged && !password.trim()) {
      Alert.alert("Utilisateur", "Mot de passe requis pour changer l'email");
      return;
    }

    setIsLoading(true);

    try {
      if (emailChanged) {
        await updateUserEmail(email, password);
        Alert.alert(
          "Vérification",
          "Un email de confirmation a été envoyé à votre nouvelle adresse.",
        );
      }

      const res = await updateUser(user.uid, userData);
      if (!res.success) {
        Alert.alert("Utilisateur", res.msg);
        setIsLoading(false);
        return;
      }

      await updateUserData(user.uid);
      router.back();
    } catch (error: unknown) {
      Alert.alert("Erreur", getFirebaseAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Modifier profil"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <PencilIcon size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Pseudo</Typo>
            <Input
              placeholder="Pseudo"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
            <Typo color={colors.neutral200}>Email</Typo>
            <Input
              placeholder="Email"
              value={userData.email}
              onChangeText={(value) =>
                setUserData({ ...userData, email: value })
              }
            />
            <Typo color={colors.neutral200}>Mot de passe actuel</Typo>
            <Input
              placeholder="Requis pour changer l'email"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={isLoading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={700}>
            Modifier
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
