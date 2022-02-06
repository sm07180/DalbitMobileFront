import { all } from "redux-saga/effects";
import common from "./common";
import main from './main';

export default function* rootSagas() {
  yield all([
    ...common
    ,...main
  ]);
}
