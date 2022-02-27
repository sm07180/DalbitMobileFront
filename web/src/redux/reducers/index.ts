import {combineReducers} from 'redux';
import common from './common/index';
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
import newAlarm from "./notice/newAlarm";
import popup from "./common/popup";

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
  , popup
  , newAlarm
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
