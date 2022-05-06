import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/profile';
import { Gender, IImageVo, ILiveBadgeList, IPaging } from "./commonType";

export type ProfileActions = ActionType<typeof actions>;

export const profilePagingDefault = {
  next: 1,
  page: 0,
  prev: 0,
  records: 20,
  total: 0,
  totalPage: 0
}

export const profileFanBoardPagingDefault = {
  next: 2,
  page: 1,
  prev: 0,
  records: 20,
  total: 0,
  totalPage: 0
}

export const profileClipPagingDefault = {
  next: 1,
  page: 0,
  prev: 0,
  records: 10,
  total: 0,
  totalPage: 0
}

export const profileDefaultState = {
  age: 0,
  badgeSpecial: 0,
  birth: "",
  broadTotTime: 0,
  byeolCnt: 0,
  commonBadgeList: [],
  count: {fanboard: 0, clip: 0, notice: 0},
  cupidMemNo: "",
  cupidNickNm: "",
  cupidProfImg: null,
  dalCnt: 0,
  exp: 0,
  expBegin: 0,
  expNext: 0,
  expRate: 0,
  fanBadge: null,
  fanCnt: 0,
  fanRank: [],
  gender: "",
  grade: "",
  holder: "",
  holderBg: "",
  isFan: false,
  isMailboxOn: false,
  isNew: false,
  isNewListener: false,
  isPop: false,
  isReceive: false,
  isRecomm: false,
  isSpecial: false,
  level: 0,
  levelColor: [],
  likeTotCnt: 0,
  listenRoomNo: "",
  listenTotTime: 0,
  liveBadgeList: [],
  liveDjRank: 0,
  liveFanRank: 0,
  listenOpen: 0,
  memId: "",
  memJoinYn: "",
  memNo: "",
  memState: 0,
  nickNm: "",
  profImg: null,
  profImgList: [],
  profMsg: "",
  profileBg: "",
  roomNo: "",
  specialDjCnt: 0,
  starCnt: 0,
  wasSpecial: false,
}

/* 방송공지 default */
export const profileNoticeDefaultState = {
  feedList: [],
  // fixedFeedList: [],
  // fixCnt: 0,
  paging: profilePagingDefault,
  isLastPage: false,
}

/* 방송공지(고정) default */
export const profileNoticeFixDefaultState = {
  fixedFeedList: [],
  fixCnt: 0,
  paging: profilePagingDefault,
  isLastPage: false
}

/* 팬보드 default */
export const profileFanBoardDefaultState = {
  list: [],
  listCnt: 0,
  paging: profileFanBoardPagingDefault,
  isLastPage: false,
}

/* 클립 default */
export const profileClipDefaultState = {
  list: [],
  paging: profileClipPagingDefault,
  isLastPage: false,
}

/* 피드 default */
export const profileFeedDefaultState = {
  feedList: [],
  paging: profilePagingDefault,
  isLastPage: false
}

/* 디테일 default */
export const profileDetailDefaultState = {
  list: [],
}

interface IFanRank {
  age: number;
  gender: Gender;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  rank: number;
}

interface ITabCount {
  fanboard: number;
  clip: number;
  notice: number;
}

interface IProfileImageList {
  idx: number;
  isLeader: boolean;
  profImg: IImageVo;
}

interface IFanBadgeData {
  text: string;
  icon: string;
  startColor: string;
  endColor: string;
  image: string;
  imageSmall: string;
  frameTop: string;
  frameChat: string;
  frameAni: string;
  tipMsg: string;
  explainMsg: string;
  enterAni: string;
  enterBgImg: string;
  msgBorderSrtColor: string;
  msgBorderEndColor: string;
  textColor: string;
  borderColor: string;
  bgAlpha: number;
  bgImg: string;
  chatImg: string;
  chatImgWidth: number;
  chatImgHeight: number;
  badgeCnt: number;
}

interface IFeedData {
  contents: string;
  imagePath: string;
  isTop: boolean;
  nickNm: string;
  noticeIdx: number;
  profImg: IImageVo | null;
  readCnt: number;
  replyCnt: number;
  title: string;
  writeDt: string;
  writeTs: number;
}

interface IFanBoardData {
  clipMemNo: string;
  contents: string;
  gender: string;
  memId: string;
  nickName: string;
  parentGroupIdx: number;
  profImg: IImageVo;
  replyCnt: number;
  replyIdx: number;
  status: number;
  viewOn: number;
  writeDt: string;
  writeTs: number;
  writerMemNo: string;
  mem_no: string;
}

interface IClipData {
  badgeSpecial: number;
  bgImg: IImageVo;
  byeolCnt: number;
  clipNo: string;
  filePlayTime: string;
  gender: string;
  goodCnt: number;
  isNew: boolean;
  isSpecial: boolean;
  memNo: string;
  nickName: string;
  playCnt: number;
  replyCnt: number;
  subjectType: string;
  title: string;
}

/* 프로필 상단 데이터 */
export interface IProfileState {
  age: number;
  badgeSpecial: number;
  birth: string;
  broadTotTime: number;
  byeolCnt: number;
  commonBadgeList: Array<ILiveBadgeList>
  count: ITabCount | null;
  cupidMemNo: string;
  cupidNickNm: string;
  cupidProfImg: IImageVo | null;
  dalCnt: number;
  exp: number;
  expBegin: number;
  expNext: number;
  expRate: number;
  fanBadge: IFanBadgeData | null;
  fanCnt: number;
  fanRank: Array<IFanRank>;
  gender: string;
  grade: string;
  holder: string;
  holderBg: string;
  isFan: boolean;
  isMailboxOn: boolean;
  isNew: boolean;
  isNewListener: boolean;
  isPop: boolean;
  isReceive: boolean;
  isRecomm: boolean;
  isSpecial: boolean;
  level: number;
  levelColor: Array<string>
  likeTotCnt: number;
  listenRoomNo: string;
  listenTotTime: number;
  liveBadgeList: Array<ILiveBadgeList>;
  liveDjRank: number;
  liveFanRank: number;
  listenOpen: number;
  memId: string;
  memJoinYn: string;
  memNo: string;
  memState: number;
  nickNm: string;
  profImg: IImageVo | null;
  profImgList: Array<IProfileImageList>
  profMsg: string;
  profileBg: string;
  roomNo: string;
  specialDjCnt: number;
  starCnt: number;
  wasSpecial: boolean;
}

/* 방송공지 */
export interface IProfileNoticeState {
  feedList: Array<IFeedData>;
  paging: IPaging;
  isLastPage: boolean;
}

/* 방송공지(고정) */
export interface IProfileNoticeFixState {
  fixedFeedList: Array<IFeedData>;
  fixCnt: number;
  paging: IPaging;
  isLastPage: boolean;
}

/* 팬보드 */
export interface IProfileFanBoardState {
  list: Array<IFanBoardData>;
  listCnt: number;
  paging: IPaging;
  isLastPage: boolean;
}

/* 클립 */
export interface IProfileClipState {
  list: Array<IClipData>;
  paging: IPaging;
  isLastPage: boolean;
}

/* 탭 */
export interface IProfileTabState {
  tabList: Array<string>;
  tabName: string;
  isRefresh: boolean;
  isReset: boolean;
}

/* 피드 */
export interface IProfileFeedState {
  feedList: Array<IFeedData>;
  paging: IPaging;
  isLastPage: boolean;
}

/* 디테일 */
export interface IProfileDetailState {
  list: Array<IFeedData>;
}