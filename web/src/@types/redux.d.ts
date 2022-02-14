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


declare function setTimeout<A extends any[]>(handler: (...args: A) => void, timeout?: number, ...arguments: A): number;
declare function setTimeout(handler: string, timeout?: number, ...arguments: any[]): number;
declare function setInterval<A extends any[]>(handler: (...args: A) => void, timeout?: number, ...arguments: A): number;
declare function setInterval(handler: string, timeout?: number, ...arguments: any[]): number;
