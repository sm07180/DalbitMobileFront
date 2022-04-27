import { all } from "redux-saga/effects";
import common from "./common";
import main from './main';
import member from "./member";
import vote from "./vote";
import broadcast from "./broadcast";
import payStore from "./payStore";

export default function* rootSagas() {
  yield all([
    ...common
    ,...main
    ,...member
    ,...vote
    ,...broadcast
    ,...payStore
  ]);
}
