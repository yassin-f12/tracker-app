import { auth, firestore } from "@/config/firebase";
import { getFirestoreErrorMessage } from "@/config/firebaseErrors";
import { ResponseType, UserDataType } from "@/types";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";
import { deleteUser as firebaseDeleteUser } from "firebase/auth";

export const updateUser = async (
  uid: string,
  updateData: UserDataType,
): Promise<ResponseType> => {
  try {
    if (typeof updateData.image === "object" && updateData.image?.uri) {
      const imageUploadRes = await uploadFileToCloudinary(
        updateData.image,
        "utilisateurs",
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Échec du téléchargement de l'image",
        };
      }

      updateData.image = imageUploadRes.data;
    }

    const userRef = doc(firestore, "utilisateurs", uid);
    await updateDoc(userRef, updateData);

    return { success: true, msg: "Mise à jour réussie !" };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};

export const deleteAccount = async (uid: string): Promise<ResponseType> => {
  try {
    const batch = writeBatch(firestore);

    const transactionsSnapshot = await getDocs(
      query(collection(firestore, "transactions"), where("uid", "==", uid)),
    );
    transactionsSnapshot.forEach((doc) => batch.delete(doc.ref));

    const walletsSnapshot = await getDocs(
      query(collection(firestore, "wallets"), where("uid", "==", uid)),
    );
    walletsSnapshot.forEach((doc) => batch.delete(doc.ref));

    batch.delete(doc(firestore, "utilisateurs", uid));

    await batch.commit();

    if (auth.currentUser) {
      await firebaseDeleteUser(auth.currentUser);
    }

    return { success: true, msg: "Compte supprimé avec succès" };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};
