export enum tabType {
  LISTENER,
  GUEST,
  LIVE,
  NOTICE,
  PROFILE,
  SETTING,
  SHORT,
  REPORT,
  GIFT_LIST,
  STORY,
  FAN_RANK,
  FAN_RANK_MY,
  FAN_RANK_USER,
  CHARGE,
  GIFT_GIVE,
  BOOST,
  GIFT_DAL,
  EMOTICON,
  LIKELIST,
  SPECIALDJLIST,
  GUEST_GIFT,
  MAKE_UP,
  FILTER,
  MINI_GAME,
  ROULETTE,
}

export const CHAT_MAX_COUNT = 500;

export const RandomMsgType = {
  GIFT: 1,
  STORY: 2,
  FAN: 3,
  GOOD: 4,
  EVENT: 5,
};

export const MediaType = {
  AUDIO: "a",
  VIDEO: "v",
};

export const MiniGameType = {
  ROLUTTE: 1,
};

export const rouletteOptions = {
  OPTION_MAX_SIZE: 8, // 옵션 개수
  ROULETTE_MIN_DAL: 1, // 룰렛 최소 금액
  ROULETTE_MAX_DAL: 1000, // 룰렛 최대 금액
  OPTION_LETTER_SIZE: 10, // 옵션 내용 글자수
}

export const BROAD_NOTICE_LENGTH = 1000;