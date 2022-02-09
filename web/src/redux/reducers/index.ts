import {combineReducers} from 'redux';
import common from './common';
import main from './main/index';
import live from './main/live';
import profile from './profile/index';
import feed from './profile/feed';
import fanBoard from './profile/fanBoard';
import profileClip from './profile/clip';

const rootReducer = combineReducers({
    common
  , main
  , live
  , profile
  , feed
  , fanBoard
  , profileClip
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
