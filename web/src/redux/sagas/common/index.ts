import {takeEvery, call, put, select, fork} from "redux-saga/effects";
import {
	SET_IS_DESKTOP,
	SET_IS_LOADING, SET_IS_LOADING_SUCCESS
} from "../../actions/common";
import {isDesktop} from "../../../lib/agent";

function* setMaxVerSion () {
	try{
		const isLoading = yield select((state)=>state.common.isLoading);
		yield put({type: SET_IS_LOADING_SUCCESS, payload: !isLoading})
	}catch (e){
		console.log(e)
	}
}

function * CommonSagas() {
	yield takeEvery(SET_IS_LOADING, setMaxVerSion)
}

function * isDesktopSagas() {
	const isDesktopVar = isDesktop();
	yield put({type: SET_IS_DESKTOP, payload: isDesktopVar})
}

const common = [
	fork(isDesktopSagas),
	CommonSagas()
]

export default common
