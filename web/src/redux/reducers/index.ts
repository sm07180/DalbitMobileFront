import {combineReducers} from 'redux';
import common from './common';
import member from './member';
import main from './main/index';
import live from './main/live';
import profile from './profile/index';
import feed from './profile/feed';
import fanBoard from './profile/fanBoard';
import profileClip from './profile/clip';
import clip from './clip/clip';
import honor from './honor/index';
import notice from './notice/index';
import inquire from "./inquire";
import profilePopup from './profile/popup';
import modalCtx from './modal';
import clipRankCtx from './clipRank';
import rankCtx from './rank';
import broadcastCtx from './broadcastCtx';
import mailBoxCtx from './mailBox';
import globalCtx from './globalCtx';

const rootReducer = combineReducers({
  common
  ,member
  , main
  , live
  , profile
  , feed
  , fanBoard
  , profileClip
  , clip
  , honor
  , notice
  , inquire
  , profilePopup
  , modalCtx
  , clipRankCtx
  , rankCtx
  , broadcastCtx
  , mailBoxCtx
  , globalCtx
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
