import { ResponseType, WalletType } from "@/types";
import { uploadFileToCloudinary } from "./imageService";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { getFirestoreErrorMessage } from "@/config/firebaseErrors";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>,
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets",
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg:
            imageUploadRes.msg ||
            "Échec du téléchargement de l'icon du portefeuille",
        };
      }

      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData?.id) {
      ((walletToSave.amount = 0),
        (walletToSave.totalIncome = 0),
        (walletToSave.totalExpenses = 0),
        (walletToSave.created = new Date()));
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
};


export const deleteWallet = async (walledId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walledId)
    await deleteDoc(walletRef)

    return {success: true, msg: "Portefeuille supprimé avec succès"}
  } catch (error: unknown) {
    return { success: false, msg: getFirestoreErrorMessage(error) };
  }
}
