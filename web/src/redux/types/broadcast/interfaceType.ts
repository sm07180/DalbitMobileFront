import {AuthType} from "../../../constant";

export enum InterfaceMediaType {
  AUDIO= "a",
  VIDEO= "v",
}

export type NativePlayerShowParamType = {
  roomNo: string
  mediaType: InterfaceMediaType
  bjNickNm: string
  title: string
  bjMemNo: string
  auth: AuthType
  bjProfImg: string
}
