import {combineReducers} from 'redux';
import common from './common';
import member from './member';
import main from './main/index';
import live from './main/live';
import profile from './profile/index';

const rootReducer = combineReducers({
    common
    ,member
  , main
  , live
  , profile
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
