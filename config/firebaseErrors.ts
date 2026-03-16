import { FirebaseError } from "firebase/app";

export const firebaseAuthErrors: Record<string, string> = {
  "auth/invalid-credential": "Identifiants incorrects",
  "auth/invalid-email": "Adresse email invalide",

  "auth/user-not-found": "Utilisateur introuvable",
  "auth/wrong-password": "Mot de passe incorrect",
  "auth/user-disabled": "Ce compte a été désactivé",

  "auth/email-already-in-use": "Cet email est déjà utilisé",
  "auth/operation-not-allowed": "Opération non autorisée",

  "auth/weak-password": "Mot de passe trop faible",
  "auth/missing-password": "Mot de passe manquant",

  "auth/network-request-failed": "Problème de connexion internet",
  "auth/too-many-requests": "Trop de tentatives, réessayez plus tard",

  "auth/internal-error": "Erreur interne, réessayez plus tard",
  "auth/invalid-verification-code": "Code de vérification invalide",
  "auth/invalid-verification-id": "ID de vérification invalide",

  "auth/requires-recent-login": "Veuillez vous reconnecter pour continuer",
};

export function getFirebaseAuthErrorMessage(error: unknown): string {

  if (error instanceof FirebaseError) {
    return firebaseAuthErrors[error.code] ?? "Erreur d'authentification";
  }

  // si c'est une erreur hors firebase, l'afficher, a centraliser plus tard aussi !
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue";
}