import {takeEvery, call, put, select} from "redux-saga/effects";
import {
	SET_IS_LOADING, SET_IS_LOADING_SUCCESS
} from "../../actions/common";

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

const common = [
	CommonSagas()
]

export default common