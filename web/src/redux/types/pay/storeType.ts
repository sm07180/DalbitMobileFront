import {ActionType} from "typesafe-actions";
import * as actions from "../../actions/payStore";

export enum OsType {
  Android = 1,
  IOS = 2,
  Desktop = 3,
  Unknown = 4,
}
export enum ModeTabType {
  inApp = 'inApp',
  other = 'other',
  none = 'none',
}
export enum ModeType {
  inApp = 'inApp',
  other = 'other',
  all = 'all',
  none = 'none',
}
export type PayStoreActions = ActionType<typeof actions>;
export type DeviceInfoType = {
  adId?: string
  appBuild?: string
  appVersion?: string
  deviceManufacturer?: string
  deviceModel?: string
  deviceToken?: string
  deviceUuid?: string
  ip?: string
  isFirst?: string
  isHybrid?: string
  os?: OsType
  sdkVersion?: string
}
export type StoreInfoType = {
  dalCnt?: number
  dalPriceList?: Array<DalPriceType>
  defaultNum?: number
  deviceInfo?: DeviceInfoType
  modeTab?: ModeTabType
  mode?: ModeType
  state?: 'ready' | 'progress'
}
export type PayStoreStateType = {
  storeInfo: StoreInfoType
  storeTabInfo: Array<StoreTabInfoType>
}
export type PayInfoType = {
  itemNm: string
  dal: string
  price: string
  itemNo: string
}

export type DalPriceType = {
  itemNo : string
  itemNm : string
  img : string
  itemType : string
  itemPrice : number
  discountRate : number
  salePrice : number
  iosPrice : string
  givenDal : number
  itemPriceDefault : number
  itemPriceIos : number
}
export type StorePagePropsType = {
  storeInfo:StoreInfoType
  storeTabInfo:Array<StoreTabInfoType>
  setStoreTabInfo: Function
}

export type StoreTabInfoType = {
  text: string
  active: boolean
  selected: boolean
  hasTip: boolean
} & Pick<StoreInfoType, 'modeTab'>

export const PAYMENT_LIST = [
  {type: '계좌 간편결제', fetch: 'pay_simple', code: 'simple'},
  {type: '무통장(계좌이체)', code: 'coocon'},
  {type: '신용/체크카드', fetch: 'pay_card'},
  {type: '휴대폰', fetch: 'pay_phone'},
  {type: '카카오페이(머니)', fetch: 'pay_km', code: 'kakaomoney'},
  {type: '카카오페이(카드)', fetch: 'pay_letter', code: 'kakaopay'},
  {type: '페이코', fetch: 'pay_letter', code: 'payco'},
  {type: '티머니/캐시비', fetch: 'pay_letter', code: 'tmoney'},
  {type: '문화상품권', fetch: 'pay_gm'},
  {type: '해피머니상품권', fetch: 'pay_hm'}
  // {type: '캐시비', fetch: 'pay_letter', code: 'cashbee'},
  // {type: "스마트문상(게임문화상품권)", fetch: 'pay_gg'},
  // {type: "도서문화상품권", fetch: 'pay_gc'},
]
export const PAYMENT_TAB:Array<StoreTabInfoType> = [
  {text:'인앱(스토어) 결제', hasTip:true, active:false, selected:false, modeTab:ModeTabType.inApp},
  {text:'신용카드 / 기타 결제', hasTip:false, active:false, selected:false, modeTab:ModeTabType.other},
]
