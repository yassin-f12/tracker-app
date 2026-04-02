import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/service/imageService";
import { deleteAccount } from "@/service/userService";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  CaretRightIcon,
  LockIcon,
  PowerIcon,
  TrashIcon,
  UserIcon,
} from "phosphor-react-native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const accountOptions: accountOptionType[] = [
  {
    title: "Modifier le profil",
    icon: <UserIcon size={26} color={colors.white} weight="fill" />,
    routeName: "/(modals)/profileModal",
    bgColor: "#6366f1",
  },
  {
    title: "Politique de confidentialité",
    icon: <LockIcon size={26} color={colors.white} weight="fill" />,
    routeName: "/(modals)/privacyModal",
    bgColor: colors.neutral600,
  },
  {
    title: "Déconnexion",
    icon: <PowerIcon size={26} color={colors.white} weight="fill" />,
    bgColor: "#e11d48",
  },
  {
    title: "Supprimer le compte",
    icon: <TrashIcon size={26} color={colors.white} weight="fill" />,
    bgColor: "#7f1d1d",
  },
];

const handleLogout = async () => {
  await signOut(auth);
};

const showLogoutAlert = () => {
  Alert.alert("Confirmation", "Êtes vous sur de vous déconnecté ?", [
    {
      text: "Annuler",
      onPress: () => {},
      style: "cancel",
    },
    {
      text: "Se déconnecter",
      onPress: () => handleLogout(),
      style: "destructive",
    },
  ]);
};

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const showDeleteAlert = () => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est irréversible. Toutes vos données (transactions, portefeuilles) seront définitivement supprimées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!user?.uid) return;
            const res = await deleteAccount(user.uid);
            if (!res.success) {
              Alert.alert(
                "Erreur",
                res.msg || "Impossible de supprimer le compte",
              );
            }
          },
        },
      ],
    );
  };

  const handlePress = (item: accountOptionType) => {
    if (item.routeName) router.push(item.routeName);
    if (item.title === "Déconnexion") showLogoutAlert();
    if (item.title === "Supprimer le compte") showDeleteAlert();
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profil" />
        <View style={styles.userInfos}>
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={600} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(30)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[
                    styles.listIcon,
                    {
                      backgroundColor: item?.bgColor,
                    },
                  ]}
                >
                  {item.icon}
                </View>
                <Typo size={16} fontWeight={500} style={{ flex: 1 }}>
                  {item.title}
                </Typo>
                <CaretRightIcon
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfos: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
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
    // overflow: "hidden",
    // position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
