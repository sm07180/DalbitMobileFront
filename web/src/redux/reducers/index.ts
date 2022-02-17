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

import globalCtx from './globalCtx';
import broadcastCtx from './broadcastCtx';
import clipRank from './clipRank';
import modal from './modal';
import rank from './rank';
import mailBox from './mailBox';

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
  , globalCtx
  , broadcastCtx
  , clipRank
  , modal
  , rank
  , mailBox
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
