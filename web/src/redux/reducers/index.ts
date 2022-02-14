import {combineReducers} from 'redux';
import common from './common';
import member from './member';
import main from './main/index';
import live from './main/live';
import profile from './profile/index';
import feed from './profile/feed';
import broadcast from './broadcast';
import fanBoard from './profile/fanBoard';
import profileClip from './profile/clip';
import clip from './clip/clip';

const rootReducer = combineReducers({
  common
  ,member
  , main
  , live
  , profile
  , feed
  , broadcast
  , fanBoard
  , profileClip
   ,clip
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
