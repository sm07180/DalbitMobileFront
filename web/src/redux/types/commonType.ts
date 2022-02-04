import { ActionType } from 'typesafe-actions';
import * as actions from '../actions/common';

export type CommonActions = ActionType<typeof actions>;

export interface CommonState {
  isLoading: boolean;
}

export type Gender = "" | "m" | "f";
export type MediaType = "a" | "v"; // a: 라디오 | v: 비디오

export interface IImageVo {
  path: string;
  thumb50x50: string;
  thumb62x62: string;
  thumb80x80: string;
  thumb88x88: string;
  thumb100x100: string;
  thumb120x120: string;
  thumb150x150: string;
  thumb190x190: string;
  thumb292x292: string;
  thumb336x336: string;
  thumb500x500: string;
  thumb700x700: string;
  url: string;
}

export interface ILiveBadgeList {
  badgeCnt: number;
  bgAlpha: number;
  bgImg: string;
  borderColor: string;
  chatImg: string;
  chatImgHeight: number;
  chatImgWidth: number;
  endColor: string;
  enterAni: string;
  enterBgImg: string;
  explainMsg: string;
  frameAni: string;
  frameChat: string;
  frameTop: string;
  icon: string;
  image: string;
  imageSmall: string;
  msgBorderEndColor: string;
  msgBorderSrtColor: string;
  startColor: string;
  text: string;
  textColor: string;
  tipMsg: string;
}