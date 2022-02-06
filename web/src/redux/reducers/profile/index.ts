import { createReducer } from "typesafe-actions";
import { IProfileState, ProfileActions, } from "../../types/profileType";

const initialState: IProfileState = {
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

const profile = createReducer<IProfileState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_DATA": (state, {payload}) => {
    console.log("SET_PROFILE_DATA state:", state)
    console.log("SET_PROFILE_DATA payload:", payload)
    return {...payload}
  }
});


export default profile;

