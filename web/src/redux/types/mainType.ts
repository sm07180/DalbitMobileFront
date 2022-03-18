import {ActionType} from 'typesafe-actions';
import * as actions from '../actions/main';
import {Gender, IImageVo, ILiveBadgeList, IPaging, MediaType} from './commonType';

export type MainActions = ActionType<typeof actions>;

interface IMoonCheck {
  moonStep: number;
  moonStepFileNm: string;
  moonStepAniFileNm: string;
  dlgTitle: string;
  dlgText: string;
  aniDuration: number;
}

interface ITopBanner {
  badgeSpecial: boolean;
  bannerUrl: string;
  commonBadgeList: Array<ILiveBadgeList>;
  gender: Gender;
  isAdmin: boolean;
  isConDj: boolean;
  isNew: boolean;
  isShining: boolean;
  isSpecial: boolean;
  isWowza: number;
  likes: number;
  listeners: number;
  liveBadgeList: Array<ILiveBadgeList>;
  mediaType: MediaType;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  roomNo: string;
  roomType: string;
  title: string;
}

interface IMyStar {
  gender: Gender;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  roomNo: string;
  roomType: string;
  roomTypeNm: string;
  title: string;
}

interface IDjRank {
  badgeSpecial: number;
  broadcastPoint: number;
  djPoint: number;
  exp: number;
  fanPoint: number;
  gender: Gender;
  giftPoint: number;
  goodPoint: number;
  grade: string;
  holder: string;
  isConDj: boolean;
  isSpecial: boolean;
  level: number;
  listenPoint: number;
  listenRoomNo: string;
  listenerPoint: number;
  liveBadgeList: Array<ILiveBadgeList>;
  liveDjRank: number;
  liveFanRank: number;
  liveTime: number;
  memId: string;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  rank: number;
  roomNo: string;
  starCnt: number;
  upDown: string;
}

interface IFanRank {
  badgeSpecial: number;
  fan: number;
  gender: Gender;
  gift: number;
  grade: string;
  holder: string;
  isSpecial: boolean;
  level: number;
  listen: number;
  listenRoomNo: string;
  liveBadgeList: Array<ILiveBadgeList>;
  memId: string;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  rank: number;
  roomNo: string;
  upDown: string;
}

interface ILoverRank {
  badgeSpecial: number;
  fan: number;
  gender: Gender;
  gift: number;
  grade: string;
  holder: string;
  isSpecial: boolean;
  level: number;
  listen: number;
  listenRoomNo: string;
  liveBadgeList: Array<ILiveBadgeList>;
  memId: string;
  memNo: string;
  nickNm: string;
  profImg: IImageVo;
  rank: number;
  roomNo: string;
  upDown: string;
}

interface IDayRanking {
  djRank: Array<IDjRank>;
  fanRank: Array<IFanRank>;
  loverRank: Array<ILoverRank>;
}

interface INewBjList {
  badge_newdj: number;
  badge_popular: number;
  badge_recomm: number;
  badge_special: number;
  bj_age: number;
  bj_birthYear: number;
  bj_memSex: Gender;
  bj_mem_no: string;
  bj_nickName: string;
  bj_play_tokenid: string;
  bj_profileImage: string;
  bj_profileImageVo: IImageVo;
  bj_publish_tokenid: string;
  bj_streamid: string;
  by: "api"
  code_link: string;
  count_boost: number;
  count_entry: number;
  count_fan: number;
  count_gold: number;
  count_good: number;
  djType: number;
  fanBadgeEndColor: string;
  fanBadgeIcon: string;
  fanBadgeImage: string;
  fanBadgeImageSmall: string;
  fanBadgeStartColor: string;
  fanBadgeText: string;
  gender: string;
  goodMem: number;
  goodMem2: number;
  goodMem3: number;
  guest_age: number;
  guest_birthYear: number;
  guest_memSex: string;
  guest_mem_no: string;
  guest_nickName: string;
  guest_play_tokenid: string;
  guest_publish_tokenid: string;
  guest_streamid: string;
  image_background: string;
  isConDj: number;
  isShining: boolean;
  isWowza: number;
  is_wowza: number;
  liveBadgeEndColor: string;
  liveBadgeIcon: string;
  liveBadgeImage: string;
  liveBadgeImageSmall: string;
  liveBadgeStartColor: string;
  liveBadgeText: string;
  liveDjRank: number;
  mediaType: MediaType;
  memLogin: number;
  mem_no: string;
  msg_welcom: string;
  notice: string;
  os_type: number;
  pageCnt: number;
  pageNo: number;
  photoSvrUrl: string;
  rank: number;
  roomNo: string;
  search: string;
  slctType: number;
  start_date: string;
  state: number;
  subjectType: string;
  subject_type: string;
  title: string;
  totalCnt: number;
  type_entry: number;
  type_image: number;
  type_media: string;
}

interface ICenterBanner {
  bannerUrl: string;
  buttonNm: string;
  contents: string;
  idx: number;
  is_button_view: number;
  is_cookie: number;
  is_title_view: number;
  linkType: string;
  linkUrl: string;
  popup_type: number;
  thumbsUrl: string;
  title: string;
}

interface ILiveList {
  badgeSpecial: number;
  bgImg: IImageVo;
  bjAge: number;
  bjGender: Gender;
  bjLevel: number;
  bjMemId: string;
  bjMemNo: string;
  bjNickNm: string;
  bjProfImg: IImageVo;
  boostCnt: number;
  byeolCnt: number;
  commonBadgeList: Array<ILiveBadgeList>;
  completeMoon: number;
  dalCnt: number;
  entryCnt: number;
  entryType: number;
  exp: number;
  expNext: number;
  freezeMsg: number;
  fullmoon_yn: number;
  giftCnt: number;
  goodMem: Array<number>;
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
  isWowza: number;
  level: number;
  likeCnt: number;
  link: string;
  liveBadgeList: Array<ILiveBadgeList>;
  liveDjRank: number;
  mediaType: MediaType;
  moonCheck: IMoonCheck;
  newFanCnt: number;
  notice: string;
  oldStep: number;
  os: number;
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


/* 메인 페이지 */
export interface IMainState {
  topBanner: Array<ITopBanner>,
  myStar: Array<IMyStar>;
  myStarCnt: number;
  dayRanking: IDayRanking;
  newBjList: Array<INewBjList>;
  centerBanner: Array<ICenterBanner>;
  newAlarmCnt: number;
  popupLevel: number;
}

/* 라이브 리스트 */
export interface IMainLiveList {
  list: Array<ILiveList>;
  paging: IPaging;
}

