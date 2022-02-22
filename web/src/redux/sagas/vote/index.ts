import {call, put, takeLatest} from "redux-saga/effects";
import Api from "../../../context/api";
import {
	DEL_VOTE,
	GET_VOTE_DETAIL_LIST,
	GET_VOTE_LIST,
	GET_VOTE_SEL,
	INS_MEM_VOTE,
	INS_VOTE,
	SET_VOTE_API_RESULT,
	SET_VOTE_DETAIL_LIST,
	SET_VOTE_LIST,
	SET_VOTE_SEL
} from "../../actions/vote";
// 투표 등록
function* insVote(param) {
	try {
		const res = yield call(Api.insVote, param.payload);
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}
// 투표
function* insMemVote(param) {
	try {
		const res = yield call(Api.insMemVote, param.payload);
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}
// 투표 삭제
function* delVote(param) {
	try {
		const res = yield call(Api.delVote, param.payload);
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}
// 투표 리스트
function* getVoteList(param) {
	try {
		const res = yield call(Api.getVoteList, param.payload);
		yield put({type: SET_VOTE_LIST, payload: res.data})
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}
// 투표 정보
function* getVoteSel(param) {
	try {
		const res = yield call(Api.getVoteSel, param.payload);
		yield put({type: SET_VOTE_SEL, payload: res.data})
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}
// 투표 항목 리스트
function* getVoteDetailList(param) {
	try {
		const res = yield call(Api.getVoteDetailList, param.payload);
		yield put({type: SET_VOTE_DETAIL_LIST, payload: res.data})
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.log(e)
	}
}

function* VoteSagas() {
	yield takeLatest(INS_VOTE, insVote)
	yield takeLatest(INS_MEM_VOTE, insMemVote)
	yield takeLatest(DEL_VOTE, delVote)
	yield takeLatest(GET_VOTE_LIST, getVoteList)
	yield takeLatest(GET_VOTE_SEL, getVoteSel)
	yield takeLatest(GET_VOTE_DETAIL_LIST, getVoteDetailList)
}

const vote = [
	VoteSagas()
]

export default vote
