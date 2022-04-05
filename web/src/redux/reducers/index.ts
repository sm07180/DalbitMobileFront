import {combineReducers} from 'redux';
import common from './common/index';
import member from './member';
import main from './main/index';
import live from './main/live';
import profile from './profile/index';
import brdcst from './profile/brdcst';
import fanBoard from './profile/fanBoard';
import profileClip from './profile/clip';
import clip from './clip/clip';
import honor from './honor/index';
import notice from './notice/index';
import inquire from "./inquire";
import newAlarm from "./notice/newAlarm";
import popup from "./common/popup";
import rank from "./rank/index"
import vote from './vote';
import broadcast from './broadcast';
import profileTab from './profile/tab';
import noticeTabList from "./notice/tabList";
import feed from "./profile/feed";
import noticeFix from "./profile/noticeFix";

const rootReducer = combineReducers({
  common
  ,member
  , main
  , live
  , profile
  , brdcst
  , fanBoard
  , profileClip
  , clip
  , honor
  , notice
  , inquire
  , popup
  , newAlarm
  , vote
  , rank
  , broadcast
  , profileTab
  , noticeTabList
  , feed
  , noticeFix
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
