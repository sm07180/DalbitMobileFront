import Live1Icon from "./static/live_1.png";
import Live2Icon from "./static/live_2.png";
import Live3Icon from "./static/live_3.png";
import Fan1Icon from "./static/fan_1.png";
import Fan2Icon from "./static/fan_2.png";
import Fan3Icon from "./static/fan_3.png";
import Fan4Icon from "./static/fan_4.png";
import Fan5Icon from "./static/fan_5.png";

export enum AuthType {
  LISTENER = 0,
  MANAGER = 1,
  GUEST = 2,
  DJ = 3,
}

// mail auth
export enum AuthTypeMail {
  ROOMINVITER = 0,
  GUEST = 1,
}

const MOBILE_OS = {
  IOS: "iOS",
  Android: "Android",
} as const;

// 'iOS' | 'Android'
export type MOBILE_OS = typeof MOBILE_OS[keyof typeof MOBILE_OS];

export const ttsContentMaxLength = 30;

export const ttsActorCookieNaming = "recentUseTTSActorId";
export const ttsAlarmDuration = 6000;