import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { StyleSheet, ScrollView, View } from "react-native";

const sections = [
  {
    title: "1. Données collectées",
    content:
      "SpendTrack collecte les informations suivantes : votre adresse e-mail et nom lors de l'inscription, vos transactions financières (montant, catégorie, description, date), et votre photo de profil si vous choisissez d'en ajouter une.",
  },
  {
    title: "2. Utilisation des données",
    content:
      "Vos données sont utilisées uniquement pour faire fonctionner l'application : afficher votre historique de transactions, générer vos statistiques personnelles et personnaliser votre expérience. Nous ne vendons ni ne partageons vos données avec des tiers.",
  },
  {
    title: "3. Stockage et sécurité",
    content:
      "Vos données sont stockées de manière sécurisée via Firebase (Google) et Cloudinary pour les images. Ces services respectent les normes de sécurité en vigueur (chiffrement SSL, authentification sécurisée).",
  },
  {
    title: "4. Authentification",
    content:
      "SpendTrack utilise Firebase Authentication pour gérer la connexion. Votre mot de passe n'est jamais stocké en clair et reste entièrement géré par Firebase.",
  },
  {
    title: "5. Vos droits (RGPD)",
    content:
      "Conformément au RGPD, vous avez le droit d'accéder à vos données, de les modifier ou de les supprimer à tout moment depuis les paramètres de votre compte.",
  },
  {
    title: "6. Conservation des données",
    content:
      "Vos données sont conservées tant que votre compte est actif. En cas de suppression du compte, l'ensemble de vos données personnelles et transactions sont définitivement supprimées.",
  },
  {
    title: "7. Modifications",
    content:
      "Cette politique peut être mise à jour ponctuellement.",
  },
];

const PrivacyModal = () => {
  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title="Politique de confidentialité"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Typo size={13} color={colors.neutral400} style={styles.lastUpdate}>
            Dernière mise à jour : avril 2025
          </Typo>

          <Typo size={14} color={colors.neutral300} style={styles.intro}>
            SpendTrack accorde une grande importance à la protection de vos
            données personnelles. Cette politique explique quelles données nous
            collectons, comment nous les utilisons et quels sont vos droits.
          </Typo>

          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Typo size={15} fontWeight={600} color={colors.neutral100}>
                {section.title}
              </Typo>
              <Typo size={14} color={colors.neutral300} style={styles.sectionText}>
                {section.content}
              </Typo>
            </View>
          ))}
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default PrivacyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  content: {
    gap: spacingY._20,
    paddingBottom: spacingY._30,
  },
  lastUpdate: {
    marginTop: spacingY._5,
  },
  intro: {
    lineHeight: 22,
  },
  section: {
    gap: spacingY._5,
  },
  sectionText: {
    lineHeight: 22,
  },
});