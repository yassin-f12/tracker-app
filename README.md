# 💸 SpendTrack

Application mobile de suivi de dépenses personnelles, développée avec **React Native / Expo** et **TypeScript**.

> Projet réalisé dans un but d'apprentissage et de progression sur React Native, Expo et TypeScript.  
> Je me suis inspiré d'une application existante pour structurer le projet, tout en me l'appropriant progressivement.

---

## 🚀 Fonctionnalités

- 🔐 Authentification (inscription / connexion) via Firebase Auth
- 💰 Gestion de plusieurs portefeuilles
- ➕ Ajout, modification et suppression de transactions (dépenses & revenus)
- 📂 Catégorisation des transactions (courses, loyer, santé, loisirs...)
- 🔍 Recherche des transactions
- 📊 Statistiques visuelles (hebdomadaires, mensuelles, annuelles)
- 🖼️ Photo de profil uploadée sur Cloudinary
- 🗑️ Suppression de compte (données Firestore supprimées intégralement)

---

## 🛠️ Stack technique

| Technologie | Usage |
|------------|-------|
| React Native + Expo | Framework mobile |
| TypeScript | Typage statique |
| Firebase Auth | Authentification |
| Firestore | Base de données |
| Cloudinary | Stockage des images |
| Expo Router | Navigation (file-based) |
| Reanimated | Animations |

---

## ⚠️ Limitations connues

**Suppression des images Cloudinary lors de la suppression de compte**  
Lors de la suppression d'un compte, toutes les données Firestore (transactions, portefeuilles, profil) sont bien supprimées. En revanche, les images uploadées sur Cloudinary (photo de profil, reçus) ne sont pas supprimées car cela nécessite une clé secrète (`CLOUDINARY_API_SECRET`) qui ne doit jamais être exposée côté client.  
La solution propre serait d'implémenter une **Firebase Cloud Function** côté serveur pour effectuer cette suppression de manière sécurisée.

---

## 🎯 Objectifs d'apprentissage

Ce projet m'a permis de progresser sur :

- La structuration d'un projet React Native avec Expo Router
- L'utilisation de TypeScript dans un contexte mobile
- L'intégration Firebase (Auth, Firestore, règles de sécurité)
- La gestion d'état et les hooks personnalisés
- Les animations avec Reanimated
- Le flux complet d'upload d'images avec Cloudinary

---

## 👤 Auteur

**Yassin Fahem**  
[Portfolio](https://yassin-f12.github.io/Portfolio---Yassin-Fahem-/) • [LinkedIn](https://www.linkedin.com/in/yassin-fahem-12-in/)