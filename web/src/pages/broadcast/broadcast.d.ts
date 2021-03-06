type broadcastAlertStatusType = {
  status: boolean;
  type: string;
};
type teamInfo = {
  teamName: string,
  medalUrl: string,
  borderUrl: string,
  backgroundUrl: string,
  pageLink: string,
};

type userProfileType = {
  auth: number;
  managerType: number;
  profImg: any;
  holder: string;
  holderBg: string;
  isFan: boolean;
  grade: string;
  level: number;
  nickNm: string;
  gender: string;
  profMsg: string;
  memId: string;
  memNo: string;
  fanCnt: number;
  starCnt: number;
  cupidNickNm: string;
  cupidMemNo: string;
  cupidProfImg: any;
  likeTotCnt: number;
  fanRank: Array<any>;
  expRate: number;
  exp: number;
  expBegin: number;
  expNext: number;
  isNew: boolean;
  isNewListener: boolean;
  isSpecial: boolean;
  badgeSpecial: number;
  specialDjCnt: number;
  wasSpecial: boolean;
  fanBadgeList: Array<any>;
  liveBadgeList: Array<any>;
  commonBadgeList: Array<any>;
  isMailboxOn: boolean;
  profImgList: Array<any>;
  teamInfo: teamInfo,
};
