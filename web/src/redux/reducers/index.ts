import {combineReducers} from 'redux';
import common from './common';
import member from './member';

const rootReducer = combineReducers({
    common
    ,member
});

export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;

