import { firestore } from "@/config/firebase";
import { getFirestoreErrorMessage } from "@/config/firebaseErrors";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

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
