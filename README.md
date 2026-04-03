# 💸 tracker-app

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

## ⚙️ Installation & Configuration

### 1. Cloner le projet
```bash
git clone https://github.com/yassin-f12/tracker-app.git
cd tracker-app
npm install
```

### 2. Configurer Firebase

Crée un projet sur [Firebase Console](https://console.firebase.google.com), active **Authentication** (email/password) et **Firestore**.

Copie le fichier exemple et remplis avec tes clés :
```bash
cp config/firebase_example.ts config/firebase.ts
```

Dans `config/firebase.ts` :
```typescript
const firebaseConfig = {
  apiKey: "ta-clé",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxx",
};
```

### 3. Configurer Cloudinary

Crée un compte sur [Cloudinary](https://cloudinary.com) et récupère ton **Cloud Name** et un **Upload Preset** (non signé).

Copie le fichier exemple et remplis avec tes clés :
```bash
cp constants/index_example.ts constants/index.ts
```

Dans `constants/index.ts` :
```typescript
export const CLOUDINARY_CLOUD_NAME = "ton-cloud-name";
export const CLOUDINARY_UPLOAD_PRESET = "ton-upload-preset";
```

### 4. Configurer les règles Firestore

Dans la console Firebase > Firestore > Règles, applique :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /utilisateurs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /wallets/{walletId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
    match /transactions/{transactionId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

### 5. Lancer l'application
```bash
npx expo start
```

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