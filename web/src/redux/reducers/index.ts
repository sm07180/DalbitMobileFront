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
import vote from './vote';
import broadcast from './broadcast';
import profileTab from './profile/tab';
import noticeTabList from "./notice/tabList";
import feed from "./profile/feed";
import noticeFix from "./profile/noticeFix";
import detail from "./profile/detail";
import payStore from './payStore';
import post from "./notice/post";

/* 기존 context */
import rankCtx from "./rankCtx"
import broadcastCtx from './broadcastCtx';
import globalCtx from './globalCtx';
import mailBoxCtx from './mailBoxCtx';
import modalCtx from './modalCtx';
import clipRankCtx from './clipRankCtx';
import clipCtx from './clipCtx';

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
  , broadcast
  , profileTab
  , noticeTabList
  , feed
  , noticeFix
  , detail
  , payStore
  , post

  , rankCtx
  , broadcastCtx
  , globalCtx
  , mailBoxCtx
  , modalCtx
  , clipRankCtx
  , clipCtx
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
