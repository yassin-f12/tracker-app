import { ImageSource } from "@/types";

export const getProfileImage = (file?: ImageSource) => {
    if (typeof file === 'string') return file;
    if (file && typeof file === 'object') return file.uri;

    return require("@/assets/images/defaultAvatar.png");
}