import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/service/walletService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { router, useLocalSearchParams } from "expo-router";
import { TrashIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();

  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Portefeuille", "Veuillez remplir tous les champs !");
      return;
    }
    if (!user?.uid) return;
    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet?.id;
    setIsLoading(true);
    const res = await createOrUpdateWallet(data);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("wallet", res.msg);
    }
  };

  const onDelete = async () => {
    if (!oldWallet?.id) return;
    setIsLoading(true);
    const res = await deleteWallet(oldWallet?.id);
    setIsLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Portefeuille", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirmer",
      "Êtes-vous sûr de vouloir supprimer définitivement ce portefeuille ? \nCette action supprimera toutes les transactions liées à ce portefeuille",
      [
        {
          text: "Annuler",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={
            oldWallet?.id ? "Modifier mon portefeuille" : "Nouveau portefeuille"
          }
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Nom du portefeuille</Typo>
            <Input
              placeholder="Salaire"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Icon du portefeuille</Typo>
            <ImageUpload
              file={wallet.image}
              onClear={() => setWallet({ ...wallet, image: null })}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              placeholder="Télécharger image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldWallet?.id && !isLoading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingY._15,
            }}
          >
            <TrashIcon
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={isLoading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={700}>
            {oldWallet?.id
              ? "Modifier le portefeuille"
              : "Ajouter un portefeuille"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

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
