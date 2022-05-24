import {takeEvery, call, put, select} from "redux-saga/effects";
import {
  SET_MAIN_DATA, SET_MAIN_DATA_SUCCESS
} from "../../actions/main";
import Api from "../../../context/api";


function* setMaxVerSion () {
	try{
	  const callMainApi = yield call(Api.main_init_data_v2);
		yield put({type: SET_MAIN_DATA_SUCCESS, payload: callMainApi.data})
	}catch (e){
		console.log(e)
	}
}

function* MainSagas() {
	yield takeEvery(SET_MAIN_DATA, setMaxVerSion)
}

const main = [
	MainSagas()
]

export default main
