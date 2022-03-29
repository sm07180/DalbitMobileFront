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
