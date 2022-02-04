import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/member';

export type MemberActions = ActionType<typeof actions>;

export type ProfImg = {
  "url": string,
  "path": string,
  "thumb50x50": string,
  "thumb62x62": string,
  "thumb80x80": string,
  "thumb88x88": string,
  "thumb100x100": string,
  "thumb120x120": string,
  "thumb150x150": string,
  "thumb190x190": string,
  "thumb292x292": string,
  "thumb336x336": string,
  "thumb500x500": string,
  "thumb700x700": string
};

type Count = {
  "fanboard": number,
  "clip": number,
  "notice": number
};

type ProfileImage = {
  "profImg": ProfImg,
  "isLeader": boolean,
  "idx": number
};


type FanBadge = {
  "text": string,
  "icon": string,
  "startColor": string,
  "endColor": string,
  "image": string,
  "imageSmall": string,
  "frameTop": string,
  "frameChat": string,
  "frameAni": string,
  "tipMsg": string,
  "explainMsg": string,
  "enterAni": string,
  "enterBgImg": string,
  "msgBorderSrtColor": string,
  "msgBorderEndColor": string,
  "textColor": string,
  "borderColor": string,
  "bgAlpha": number,
  "bgImg": string,
  "chatImg": string,
  "chatImgWidth": number,
  "chatImgHeight": number,
  "badgeCnt": number
};


export type Member = {
  "memNo": number,
  "nickNm": string,
  "gender": string,
  "age": number,
  "birth": string,
  "memId": string,
  "profImg": ProfImg,
  "profMsg": string,
  "level": number,
  "fanCnt": number,
  "starCnt": number,
  "isFan": true,
  "exp": number,
  "expBegin": number,
  "expNext": number,
  "expRate": number,
  "grade": string,
  "dalCnt": number,
  "byeolCnt": number,
  "isRecomm": false,
  "isPop": false,
  "isNew": true,
  "isSpecial": false,
  "badgeSpecial": number,
  "roomNo": string,
  "broadTotTime": number,
  "listenTotTime": number,
  "likeTotCnt": number,
  "holder": string,
  "holderBg": string,
  "profileBg": string,
  "fanRank": [],
  "fanBadge": FanBadge,
  "fanBadgeList": [],
  "commonBadgeList": [],
  "cupidMemNo": string,
  "cupidNickNm": string,
  "cupidProfImg": ProfImg,
  "isNewListener": true,
  "count": Count,
  "liveBadgeList": [],
  "liveDjRank": number,
  "liveFanRank": number,
  "wasSpecial": boolean,
  "specialDjCnt": number,
  "memState": number,
  "levelColor": Array<string>,
  "listenRoomNo": string,
  "isReceive": boolean,
  "profImgList": Array<ProfileImage>,
  "isMailboxOn": boolean,
  "memJoinYn": string
}

export type LoginToken  = {
  isLogin : boolean
  authToken : string
  memNo : string
}

export type MemberState = LoginToken & {
  data?:Member | null
}
