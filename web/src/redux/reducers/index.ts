import {combineReducers} from 'redux';
import common from './common';
import main from './main/index';
import live from './main/live';

const rootReducer = combineReducers({
    common
  , main
  , live
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;

