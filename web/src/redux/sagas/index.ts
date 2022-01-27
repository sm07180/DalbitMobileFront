import { all } from "redux-saga/effects";
import common from "./common";

export default function* rootSagas() {
  yield all([
    ...common
  ]);
}
