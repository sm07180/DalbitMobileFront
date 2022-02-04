import 'redux';
import { Task } from 'redux-saga';
import {AppState} from '../redux/reducers';

declare module 'react-redux' {
  interface DefaultRootState extends AppState {};
}

declare module 'redux' {
  export interface Store {
    sagaTask?: Task;
  }
}