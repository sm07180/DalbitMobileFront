import {call, put, select, takeEvery, takeLatest} from "redux-saga/effects";
import Api from "../../../context/api";
import {
	DEL_VOTE,
	GET_VOTE_DETAIL_LIST,
	GET_VOTE_LIST,
	GET_VOTE_SEL,
	INS_MEM_VOTE,
	INS_VOTE, MOVE_VOTE_INS_STEP, MOVE_VOTE_LIST_STEP,
	MOVE_VOTE_STEP,
	SET_SEL_VOTE_ITEM,
	SET_TEMP_INS_VOTE,
	SET_VOTE_API_RESULT,
	SET_VOTE_DETAIL_LIST,
	SET_VOTE_LIST,
	SET_VOTE_SEL,
	SET_VOTE_STEP
} from "../../actions/vote";
import {GetVoteSelRequestType, VoteResultType, VoteStepType} from "../../types/voteType";
import {initTempInsVote} from "../../reducers/vote";

// 투표 등록
function* insVote(param) {
	try {
		const res = yield call(Api.insVote, param.payload);
		if(res.data > 0){
			yield put({type: SET_TEMP_INS_VOTE, payload: initTempInsVote});
			yield put({type: MOVE_VOTE_LIST_STEP, payload: {...param.payload, voteSlct: 's'}});
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
			const data:Array<VoteResultType> = getVoteDetailList.data;
			if(data){
				yield put({type: SET_VOTE_DETAIL_LIST, payload: data})
				const sel = data.find(f=>f.memVoteYn === 'y');
				if(sel){
					yield put({type: SET_SEL_VOTE_ITEM, payload: sel})
				}
			}

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
			yield put({type: MOVE_VOTE_LIST_STEP, payload: {...param.payload, voteSlct: 's'}});
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

function* moveVoteStep(param) {
	try {
		// memNo roomNo voteNo
		const getVoteSel = yield call(Api.getVoteSel, param.payload);
		yield put({type: SET_VOTE_SEL, payload: getVoteSel.data})
		// memNo pmemNo roomNo voteNo
		const member = yield select((state)=>state.member);
		const getVoteDetailList = yield call(Api.getVoteDetailList, {...param.payload, pmemNo:member.memNo});
		const data:Array<VoteResultType> = getVoteDetailList.data;
		if(data){
			yield put({type: SET_VOTE_DETAIL_LIST, payload: data})
			const sel = data.find(f=>f.memVoteYn === 'y');
			if(sel){
				yield put({type: SET_SEL_VOTE_ITEM, payload: sel})
			}
		}
		yield put({type: SET_VOTE_STEP, payload: 'vote'})
	} catch (e) {
		console.error(`moveVoteStep saga e=>`, e)
	}
}
function* moveVoteListStep(param) {
	try {
		// debugger
		const res = yield call(Api.getVoteList, param.payload);
		console.log(`getVoteList`, res)
		yield put({type: SET_VOTE_LIST, payload: res.data})
		yield put({type: SET_VOTE_STEP, payload: 'list'})
	} catch (e) {
		console.error(`moveVoteListStep saga e=>`, e)
	}

}
function* moveVoteInsStep(param) {
	try {

		yield put({type: SET_VOTE_STEP, payload: 'ins'})
	} catch (e) {
		console.error(`moveVoteInsStep saga e=>`, e)
	}
}
// memNo roomNo voteSlct
// const getVoteList = yield call(Api.getVoteList, {
// 	...param.payload
// 	, voteSlct: 's'
// });
// console.log(`saga getVoteList,`, getVoteList)
// yield put({type: SET_VOTE_LIST, payload: getVoteList.data});
function* VoteSagas() {
	yield takeLatest(INS_VOTE, insVote)
	yield takeLatest(INS_MEM_VOTE, insMemVote)
	yield takeLatest(DEL_VOTE, delVote)
	yield takeLatest(GET_VOTE_LIST, getVoteList)
	yield takeLatest(GET_VOTE_SEL, getVoteSel)
	yield takeLatest(GET_VOTE_DETAIL_LIST, getVoteDetailList)
	yield takeEvery(MOVE_VOTE_LIST_STEP, moveVoteListStep)
	yield takeEvery(MOVE_VOTE_STEP, moveVoteStep)
	yield takeEvery(MOVE_VOTE_INS_STEP, moveVoteInsStep)
}

const vote = [
	VoteSagas()
]

export default vote
