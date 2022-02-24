import {call, put, takeEvery, takeLatest} from "redux-saga/effects";
import Api from "../../../context/api";
import {
	DEL_VOTE,
	GET_VOTE_DETAIL_LIST,
	GET_VOTE_LIST,
	GET_VOTE_SEL,
	INS_MEM_VOTE,
	INS_VOTE, INTERACTION_VOTE,
	SET_VOTE_API_RESULT,
	SET_VOTE_DETAIL_LIST, SET_VOTE_INTERACTION,
	SET_VOTE_LIST,
	SET_VOTE_SEL
} from "../../actions/vote";

// 투표 등록
function* insVote(param) {
	try {
		const res = yield call(Api.insVote, param.payload);
		if(res.data > 0){
			const getVoteList = yield call(Api.getVoteList, {
				...param.payload
				, voteSlct: 's'
			});
			yield put({type: SET_VOTE_LIST, payload: getVoteList.data})
		}
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.error(`insVote saga e=>`, e)
	}
}
// 투표
function* insMemVote(param) {
	try {
		const res = yield call(Api.insMemVote, param.payload);

		// 'memNo' | 'pmemNo' | 'roomNo' | 'voteNo' | 'itemNo' | 'voteItemName'
		if(res.data > 0){
			const reSelectParam = {
				...param.payload
				, voteSlct: 's'
			}
			// memNo roomNo voteSlct
			const getVoteList = yield call(Api.getVoteList, reSelectParam);
			yield put({type: SET_VOTE_LIST, payload: getVoteList.data})
			// memNo roomNo voteNo
			const getVoteSel = yield call(Api.getVoteSel, reSelectParam);
			yield put({type: SET_VOTE_SEL, payload: getVoteSel.data})
			// memNo pmemNo roomNo voteNo
			const getVoteDetailList = yield call(Api.getVoteDetailList, reSelectParam);
			yield put({type: SET_VOTE_DETAIL_LIST, payload: getVoteDetailList.data})
		}

		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.error(`insMemVote saga e=>`, e)
	}
}
// 투표 삭제
function* delVote(param) {
	try {
		// memNo roomNo voteNo
		const res = yield call(Api.delVote, param.payload);
		if(res.data > 0){
			// memNo roomNo voteSlct
			const getVoteList = yield call(Api.getVoteList, {
				...param.payload
				, voteSlct: 's'
			});
			yield put({type: SET_VOTE_LIST, payload: getVoteList.data})
		}
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.error(`delVote saga e=>`, e)
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
		console.error(`getVoteList saga e=>`, e)
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
		console.error(`getVoteSel saga e=>`, e)
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
		console.error(`getVoteDetailList saga e=>`, e)
	}
}
// 투표 화면 제어
function* interactionVote(param) {
	try {
		// const res = yield call(Api.getVoteDetailList, param.payload);
		// yield put({type: SET_VOTE_DETAIL_LIST, payload: res.data})
		// delete res.data
		// yield put({type: SET_VOTE_API_RESULT, payload: res})
		yield put({type: SET_VOTE_INTERACTION, payload: param.payload})
	} catch (e) {
		console.error(`getVoteDetailList saga e=>`, e)
	}
}
function* VoteSagas() {
	yield takeLatest(INS_VOTE, insVote)
	yield takeLatest(INS_MEM_VOTE, insMemVote)
	yield takeLatest(DEL_VOTE, delVote)
	yield takeLatest(GET_VOTE_LIST, getVoteList)
	yield takeLatest(GET_VOTE_SEL, getVoteSel)
	yield takeLatest(GET_VOTE_DETAIL_LIST, getVoteDetailList)
	yield takeEvery(INTERACTION_VOTE, interactionVote)
}

const vote = [
	VoteSagas()
]

export default vote
