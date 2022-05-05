import {ActionType} from "typesafe-actions";
import * as actions from "../actions/search";
import {Gender, ICommonPopupState, IImageVo, ILiveBadgeList, IPaging, MediaType, OsType} from "./commonType";

export type SearchActions = ActionType<typeof actions>;

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

interface ILiveListInfoType {
  list: Array<searchLiveListType>;
  paging: IPaging | {};
  totalCnt: number;
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

interface IHotClipListInfoType {
  checkDate: string;
  list: Array<hotClipListType>;
  totalCnt: number;
  type: number;
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

interface ISearchDjListInfoType {
  list: Array<djListType>
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
  commonBadgeList: ICommonPopupState;
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

interface INewBjListInfoType {
  list: Array<newBjListType>;
  paging: IPaging | {};
  totalCnt: number;
}

export interface ISearchStateType {
  searchVal: string;
  searchParam: string;
  searching: boolean;
  liveListInfo: ILiveListInfoType;
  hotClipListInfo: IHotClipListInfoType;
  djListInfo: ISearchDjListInfoType;
  newBjListInfo: INewBjListInfoType;
}