import { firestore } from "@/config/firebase";
import { getFirestoreErrorMessage } from "@/config/firebaseErrors";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";

export const updateUser = async (
  uid: string,
  updateData: UserDataType,
): Promise<ResponseType> => {
  try {
    const userRef = doc(firestore, "utilisateurs", uid);
    await updateDoc(userRef, updateData);

    return { success: true, msg: "Mise à jour réussie !"};
  } catch (error: unknown) {
    console.log("Erreur lors de la mise à jour utilisateur : ", error);
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};
