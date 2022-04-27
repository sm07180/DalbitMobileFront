export default class PhotoCommon{
  static getPhotoUrl = (serverUrl, photoUrl, size) => {
    const url = (photoUrl === "" || typeof photoUrl === "undefined" || photoUrl === null) ? serverUrl + "/profile_3/profile_m_200327.jpg" : serverUrl + photoUrl + "?" + size;
    return url;
  }
}