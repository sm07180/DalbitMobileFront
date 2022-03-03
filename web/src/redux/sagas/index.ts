import { all } from "redux-saga/effects";
import common from "./common";
import main from './main';
import member from "./member";
import vote from "./vote";

export default function* rootSagas() {
  yield all([
    ...common
    ,...main
    ,...member
    ,...vote
  ]);
}
