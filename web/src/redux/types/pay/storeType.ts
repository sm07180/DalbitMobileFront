export enum OsType {
  Android = 1,
  IOS = 2,
  Desktop = 3,
  Unknown = 4,
}
export type StoreInfoType = {
  myDal: number
  dalPriceList: Array<DalPriceType>
  defaultNum: number
  os: OsType
  modeTab: 'inApp' | 'other'
  mode: 'inApp' | 'other' | 'all' | 'none'
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
  select: number
  payInfo: PayInfoType
  setSelect: Function
  setPayInfo: Function
}


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
