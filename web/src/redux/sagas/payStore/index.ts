import {call, put, select, takeLatest} from "redux-saga/effects";
import {GET_DAL_CNT, GET_INDEX_DATA, GET_PRICE_LIST, SET_STORE_INFO, SET_STORE_TAB_INFO} from "../../actions/payStore";
import {getDalCnt, getDalPriceList, getStoreIndexData} from "../../../common/api";
import {ModeTabType, ModeType, PayStoreStateType, StoreInfoType} from "../../types/pay/storeType";
import {Action} from "history";

function* updateIndexData(param) {
	try {
		const res = yield call(getStoreIndexData);
		const payload = {
			dalCnt: res.data.dalCnt,
			defaultNum: res.data.defaultNum,
			deviceInfo: res.data.deviceInfo,
			mode: res.data.mode,
			modeTab: res.data.platform,
		}
		yield put({type: SET_STORE_INFO, payload: payload});
		const payStore:PayStoreStateType = yield select(({payStore})=>payStore);
		const copy = payStore.storeTabInfo.map(m=>{
			m.active = res.data.mode === ModeType.all ? true : m.modeTab === res.data.platform;

			const before = payStore.storeTabInfo.find(f=>f.selected);

			const payload:Action = param.payload;

			m.selected = payload === 'POP' && before ? m.modeTab === before.modeTab :
				res.data.mode === ModeType.all ?
					m.modeTab === ModeTabType.inApp : m.modeTab === res.data.mode;

			return m;
		});
		yield put({type: SET_STORE_TAB_INFO, payload: copy});
	} catch (e) {
		console.error(`getIndexData saga e=>`, e)
	}
}

function* updatePriceList(param) {
	try {
		if(!param.payload){
			console.error(`getPriceList saga payload =>`, param.payload)
			return;
		}

		yield put({type: SET_STORE_INFO, payload: {dalPriceList: []}});
		const res = yield call(getDalPriceList, {platform:param.payload});
		yield put({type: SET_STORE_INFO, payload: {dalPriceList: res.data.dalPriceList}});
	} catch (e) {
		console.error(`getPriceList saga e=>`, e)
	}
}

function* updateDalCnt(param) {
	try {
		if(!param.payload){
			console.error(`updateDalCnt saga payload =>`, param.payload)
			return;
		}
		const res = yield call(getDalCnt);
		yield put({type: SET_STORE_INFO, payload: {dalCnt: res.data.dalCnt}});
	} catch (e) {
		console.error(`updateDalCnt saga e=>`, e)
	}
}
function* PayStoreSagas() {
	yield takeLatest(GET_INDEX_DATA, updateIndexData)
	yield takeLatest(GET_PRICE_LIST, updatePriceList)
	yield takeLatest(GET_DAL_CNT, updateDalCnt)
}

const payStore = [
	PayStoreSagas()
]

export default payStore
