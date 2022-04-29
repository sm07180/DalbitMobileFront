import {PHOTO_SERVER} from "context/config";

export default class PhotoCommon{
  static getPhotoUrl = (photoUrl, size) => {
    const url = (photoUrl === "" || typeof photoUrl === "undefined" || photoUrl === null) ? "/profile_3/profile_m_200327.jpg" : photoUrl + "?" + size;
    return PHOTO_SERVER + url;
  }
}