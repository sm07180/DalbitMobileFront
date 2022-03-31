import {call, put, select, takeLatest} from "redux-saga/effects";
import {GET_INDEX_DATA, GET_PRICE_LIST, SET_STORE_INFO, SET_STORE_TAB_INFO} from "../../actions/payStore";
import {getDalPriceList, getStoreIndexData} from "../../../common/api";
import {ModeTabType, ModeType, PayStoreStateType} from "../../types/pay/storeType";

function* getIndexData(param) {
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

			m.selected = before ? m.modeTab === before.modeTab :
				res.data.mode === ModeType.all ?
					m.modeTab === ModeTabType.inApp : m.modeTab === res.data.mode;

			return m;
		});
		yield put({type: SET_STORE_TAB_INFO, payload: copy});
	} catch (e) {
		console.error(`getIndexData saga e=>`, e)
	}
}

function* getPriceList(param) {
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

function* PayStoreSagas() {
	yield takeLatest(GET_INDEX_DATA, getIndexData)
	yield takeLatest(GET_PRICE_LIST, getPriceList)
}

const payStore = [
	PayStoreSagas()
]

export default payStore
