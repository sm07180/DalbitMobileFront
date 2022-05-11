import {ActionType} from "typesafe-actions";
import * as actions from "../actions/search";
import {Gender, IImageVo, ILiveBadgeList, IPaging, MediaType, OsType} from "./commonType";

export type SearchActions = ActionType<typeof actions>;

export const changeSubject = (value) => {
  switch (value) {
    case '01': return '커버';
    case '02': return '작사/작곡';
    case '03': return '더빙';
    case '04': return '수다/대화';
    case '05': return '고민/사연';
    case '06': return '힐링';
    case '07': return '성우';
    case '08': return 'ASMR';
    default: break;
  }
};

// 지금 핫한 라이브
type searchLiveListType = {
  badgeSpecial: number;
  bgImg: IImageVo;
  entryCnt: number;
  entryType: number;
  imageType: number;
  isConDj: boolean;
  isSpecial: boolean;
  nickNm: string;
  roomNo: string;
  roomType: string;
  startDt: string;
  startTs: number;
  title: string;
}

export interface ILiveListInfoType {
  list: Array<searchLiveListType>;
  paging: IPaging | {};
}

// 방금 착륙한 NEW 달린이
type newBjListType = {
  badgePartner: number;
  badgeSpecial: number;
  badge_partner: number;
  bgImg: IImageVo;
  bjAge: number;
  bjGender: Gender
  bjLevel: number;
  bjMemId: string;
  bjMemNo: string;
  bjNickNm: string;
  bjProfImg: IImageVo;
  boostCnt: number;
  byeolCnt: number;
  commonBadgeList: [];
  completeMoon: number;
  dalCnt: number;
  entryCnt: number;
  entryType: number;
  exp: number;
  expNext: number;
  freezeMsg: number;
  fullmoon_yn: number;
  giftCnt: number;
  goodMem: [];
  grade: string;
  gstAge: number;
  gstGender: Gender;
  gstLevel: number;
  gstMemId: string;
  gstMemNo: string;
  gstNickNm: string;
  gstProfImg: IImageVo;
  imageType: number;
  isAttendCheck: boolean;
  isAttendUrl: string;
  isCall: boolean;
  isConDj: boolean;
  isExtend: boolean;
  isFreeze: boolean;
  isGoodMem: boolean;
  isMic: boolean;
  isMinigame: boolean;
  isNew: boolean;
  isPop: boolean;
  isRecomm: boolean;
  isServer: boolean;
  isShining: boolean;
  isSpecial: boolean;
  isVideo: boolean;
  isVote: boolean;
  isWowza: number;
  level: number;
  likeCnt: number;
  link: string;
  liveBadgeList: ILiveBadgeList;
  liveDjRank: number;
  mediaType: MediaType;
  moonCheck: {moonStep: number; moonStepFileNm: string; moonStepAniFileNm: string; dlgTitle: string; dlgText: string; aniDuration: number;}
  newFanCnt: number;
  notice: string;
  oldStep: number;
  os: OsType;
  rank: number;
  roomNo: string;
  roomType: string;
  startDt: string;
  startTs: number;
  state: number;
  step: number;
  title: string;
  totalCnt: number;
  welcomMsg: string;
}

export interface INewDjListInfoType {
  list: Array<newBjListType>;
  paging: IPaging | {};
}

export interface INewDjListParamType {
  page: number;
  mediaType: MediaType;
  records: number;
  roomType: string;
  searchType: number;
  djType: number;
  gender: Gender;
}

// 오늘 인기있는 클립
type hotClipListType = {
  badgeSpecial: number;
  bgImg: IImageVo
  clipNo: string;
  filePlayTime: string;
  gender: Gender
  goodCnt: number;
  isConDj: boolean;
  isNew: boolean;
  isSpecial: boolean;
  memNo: string;
  nickName: string;
  playCnt: number;
  replyCnt: number;
  subjectType: string;
  title: string;
}

export interface IHotClipListInfoType {
  list: Array<hotClipListType>;
}

// 믿고 보는 DJ
type djListType = {
  ageDesc: string;
  ageType: number;
  desc: string;
  dj_keyword: string;
  gender: Gender;
  isFan: boolean;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  roomNo: string;
  title: string;
  tot_clip_play_cnt: number;
  tot_listener_cnt: number;
}

export interface ISearchDjListInfoType {
  list: Array<djListType>
}


// 검색 결과 탭 메뉴
type searchResultTabMenuType = "전체" | "DJ" | "라이브" | "클립";
type tabType = 0 | 1 | 2 | 3; // 0: 전체, 1: DJ, 2: 라이브, 3: 클립

// 검색 결과 정보 (탭, 페이징 정보)
export interface ISearchResultInfoType {
  tabType: tabType;
  page: number;
  records: number;
}

// 검색 결과 DJ 리스트
export interface ISearchResultDjListType {
  badgeSpecial: number;
  fanCnt: number;
  gender: Gender;
  isConDj: boolean;
  isNew: boolean;
  isSpecial: boolean;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  roomNo: string;
}

export interface ISearchResultDjInfoType {
  list: Array<ISearchResultDjListType>;
  paging: IPaging;
}

export type searchResultInfoReqType = {
  search: string;
  page?: number;
  records?: number;
  tabType?: number;
  slctType?: number;
  dateType?: number;
}

// 검색 결과 라이브 리스트
export interface ISearchResultLiveInfoListType {
  badgePartner: number;
  badgeSpecial: number;
  badge_partner: number;
  bgImg: IImageVo;
  bjAge: number;
  bjGender: Gender
  bjLevel: number;
  bjMemId: string;
  bjMemNo: string;
  bjNickNm: string;
  bjProfImg: IImageVo
  boostCnt: number;
  byeolCnt: number;
  commonBadgeList: [];
  completeMoon: number;
  dalCnt: number;
  entryCnt: number;
  entryType: number;
  exp: number;
  expNext: number;
  freezeMsg: number;
  fullmoon_yn: number;
  giftCnt: number;
  goodMem: []
  grade: string;
  gstAge: number;
  gstGender: Gender;
  gstLevel: number;
  gstMemId: string;
  gstMemNo: string;
  gstNickNm: string;
  gstProfImg: IImageVo
  imageType: number;
  isAttendCheck: boolean;
  isAttendUrl: string;
  isCall: boolean;
  isConDj: boolean;
  isExtend: boolean;
  isFreeze: boolean;
  isGoodMem: boolean;
  isMic: boolean;
  isMinigame: boolean;
  isNew: boolean;
  isPop: boolean;
  isRecomm: boolean;
  isServer: boolean;
  isShining: boolean;
  isSpecial: boolean;
  isVideo: boolean;
  isVote: boolean;
  isWowza: number;
  level: number;
  likeCnt: number;
  link: string;
  liveBadgeList: ILiveBadgeList;
  liveDjRank: number;
  mediaType: MediaType;
  moonCheck: {moonStep: number; moonStepFileNm: string; moonStepAniFileNm: string; dlgTitle: string; dlgText: string; aniDuration: number;}
  newFanCnt: number;
  notice: string;
  oldStep: number;
  os: OsType
  rank: number;
  roomNo: string;
  roomType: string;
  startDt: string;
  startTs: number;
  state: number;
  step: number;
  title: string;
  totalCnt: number;
  welcomMsg: string;
}

export interface ISearchResultLiveInfoType {
  list: Array<ISearchResultLiveInfoListType>;
  paging: IPaging;
}

// 검색 결과 클립 리스트
export interface ISearchResultClipInfoListType {
  badgeSpecial: number;
  bgImg: IImageVo;
  birthYear: number;
  byeolCnt: number;
  clipNo: string;
  entryType: number;
  filePlayTime: string;
  gender: Gender;
  goodCnt: number;
  isConDj: boolean;
  isNew: boolean;
  isSpecial: boolean;
  memNo: string;
  nickName: string;
  os: OsType
  playCnt: number;
  profImg: IImageVo;
  replyCnt: number;
  subjectType: string;
  title: string;
  total: number;
}

export interface ISearchResultClipInfoType {
  list: Array<ISearchResultClipInfoListType>
  paging: IPaging;
}

export const searchPagingDefault = { next: 0, page: 0, prev: 0, records: 0, total: 0, totalPage: 0 };

export interface ISearchStateType {
  // 검색 정보
  searchVal: string;
  searchParam: string;
  searching: boolean;

  // 검색 페이지 기본
  liveListInfo: ILiveListInfoType;
  newDjListInfo: INewDjListInfoType;
  hotClipListInfo: IHotClipListInfoType;
  djListInfo: ISearchDjListInfoType;

  // 검색 결과
  searchResultTabMenuList: Array<searchResultTabMenuType>;
  searchResultInfo: ISearchResultInfoType;
  searchResultDjInfo: ISearchResultDjInfoType;
  searchResultLiveInfo: ISearchResultLiveInfoType;
  searchResultClipInfo: ISearchResultClipInfoType;
}