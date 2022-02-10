import {takeEvery, call, put, select} from "redux-saga/effects";
import {
	GET_MEMBER_PROFILE, GET_MEMBER_PROFILE_SUCCESS, SET_MEMBER_LOGIN
} from "../../actions/member";
import Api from "../../../context/api";
import {initialState} from "../../reducers/member";

function* getMemberProfileSaga (param) {
	try{
		yield put({type: SET_MEMBER_LOGIN, payload: param.payload})
		const profileResponse = yield call (Api.profile, {params: {memNo: param.payload.memNo}});
		if (profileResponse.result === 'success') {
			yield put({type: GET_MEMBER_PROFILE_SUCCESS, payload: profileResponse.data })
		}else{
			yield put({type: SET_MEMBER_LOGIN, payload: initialState})
		}
	}catch (e){
		console.log(e)
	}
}

function * MemberSagas() {
	yield takeEvery(GET_MEMBER_PROFILE, getMemberProfileSaga)
}

const member = [
	MemberSagas()
]

export default member