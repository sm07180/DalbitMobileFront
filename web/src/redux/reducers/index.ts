import {combineReducers} from 'redux';
import common from './common';
import member from './member';
import main from './main/index';
import live from './main/live';

const rootReducer = combineReducers({
    common
    ,member
  , main
  , live
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;

