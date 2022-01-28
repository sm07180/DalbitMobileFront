import { all } from "redux-saga/effects";
import common from "./common";
import member from "./member";

export default function* rootSagas() {
  yield all([
    ...common,
    ...member
  ]);
}
