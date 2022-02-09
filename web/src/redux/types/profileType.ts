import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/profile';
import { Gender, IImageVo, ILiveBadgeList, IPaging } from "./commonType";

export type ProfileActions = ActionType<typeof actions>;

const pagingDefault = {
  next: 0,
  page: 0,
  prev: 0,
  records: 0,
  total: 0,
  totalPage: 0
}

/* 피드 default */
export const profileFeedDefaultState = {
  feedList: [],
  fixedFeedList: [],
  fixCnt: 0,
  paging: pagingDefault,
  scrollPaging: {
    pageNo: 1,
    pagePerCnt: 20,
    currentCnt: 0,
  }
}

/* 팬보드 default */
export const profileFanBoardDefaultState = {
  list: [],
  paging: pagingDefault,
  scrollPaging: {
    pageNo: 1,
    pagePerCnt: 20,
    currentCnt: 0,
  }
}

/* 클립 default */
export const profileClipDefaultState = {
  list: [],
  paging: pagingDefault,
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

interface scrollPaging {
  pageNo: number;
  pagePerCnt: number;
  currentCnt: number;
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

/* 피드 */
export interface IProfileFeedState {
  feedList: Array<IFeedData>,
  fixedFeedList: Array<IFeedData>,
  fixCnt: number;
  paging: IPaging,
  scrollPaging: scrollPaging,
}

/* 팬보드 */
export interface IProfileFanBoardState {
  list: Array<IFanBoardData>,
  paging: IPaging,
  scrollPaging: scrollPaging,
}

/* 클립 */
export interface IProfileClipState {
  list: Array<IClipData>,
  paging: IPaging,
}