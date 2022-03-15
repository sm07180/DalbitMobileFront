import {call, delay, put, race, select, takeEvery, takeLatest} from "redux-saga/effects";
import Api from "../../../context/api";
import {
	DEL_VOTE, END_VOTE,
	GET_VOTE_DETAIL_LIST,
	GET_VOTE_LIST,
	INS_MEM_VOTE,
	INS_VOTE, MOVE_VOTE_INS_STEP, MOVE_VOTE_LIST_STEP,
	MOVE_VOTE_STEP,
	SET_SEL_VOTE_ITEM,
	SET_TEMP_INS_VOTE,
	SET_VOTE_API_RESULT,
	SET_VOTE_DETAIL_LIST,
	SET_VOTE_LIST,
	SET_VOTE_SEL,
	SET_VOTE_STEP, SET_VOTE_TAB
} from "../../actions/vote";
import {VoteResultType, VoteSlctKor} from "../../types/voteType";
import {initTempInsVote, initVoteSel} from "../../reducers/vote";

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
			// const selAndDetailList = yield call(reSelectParam);
			const selAndDetailList = yield call(Api.getVoteSelAndDetailList, reSelectParam);
			if(selAndDetailList){
				yield put({type: SET_VOTE_SEL, payload: selAndDetailList.data.sel})
				const data:Array<VoteResultType> = selAndDetailList.data.detailList;
				if(data){
					yield put({type: SET_VOTE_DETAIL_LIST, payload: data})
					const sel = data.find(f=>f.memVoteYn === 'y');
					if(sel){
						yield put({type: SET_SEL_VOTE_ITEM, payload: sel})
					}
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
// 투표 마감
function* endVote(param) {
	try {
		// memNo roomNo voteNo endSlct
		const res = yield call(Api.endVote, param.payload);
		if(param.payload.endSlct === 'o'){

		}
		if(res.data > 0){
			yield put({type: MOVE_VOTE_LIST_STEP, payload: {...param.payload, voteSlct: 's'}});
		}
		delete res.data
		yield put({type: SET_VOTE_API_RESULT, payload: res})
	} catch (e) {
		console.error(`endVote saga e=>`, e)
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
		const member = yield select((state)=>state.member);
		const selAndDetailList = yield call(Api.getVoteSelAndDetailList, {...param.payload, pmemNo:member.memNo});
		if(selAndDetailList){
			yield put({type: SET_VOTE_SEL, payload: selAndDetailList.data.sel})
			const data:Array<VoteResultType> = selAndDetailList.data.detailList;
			if(data) {
				yield put({type: SET_VOTE_DETAIL_LIST, payload: data})
				const sel = data.find(f=>f.memVoteYn === 'y');
				if(sel){
					yield put({type: SET_SEL_VOTE_ITEM, payload: sel})
				}else{
					yield put({type: SET_SEL_VOTE_ITEM, payload: initVoteSel})
				}
			}
			yield put({type: SET_VOTE_STEP, payload: 'vote'})
		}
		delete selAndDetailList.data
		yield put({type: SET_VOTE_API_RESULT, payload: selAndDetailList})
	} catch (e) {
		console.error(`moveVoteStep saga e=>`, e)
	}
}
function* moveVoteListStep(param) {
	try {
		// debugger
		const res = yield call(Api.getVoteList, param.payload);
		yield put({type: SET_VOTE_LIST, payload: res.data})
		yield put({type: SET_VOTE_STEP, payload: 'list'})
		yield put({type: SET_VOTE_TAB, payload: param.payload.voteSlct === 's' ? VoteSlctKor.S : VoteSlctKor.E})
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
	yield takeLatest(END_VOTE, endVote)
	yield takeLatest(GET_VOTE_LIST, getVoteList)
	yield takeLatest(GET_VOTE_DETAIL_LIST, getVoteDetailList)
	yield takeEvery(MOVE_VOTE_LIST_STEP, moveVoteListStep)
	yield takeEvery(MOVE_VOTE_STEP, moveVoteStep)
	yield takeEvery(MOVE_VOTE_INS_STEP, moveVoteInsStep)
}

const vote = [
	VoteSagas()
]

export default vote
