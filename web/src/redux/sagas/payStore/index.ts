import {call, put, select, takeEvery, takeLatest} from "redux-saga/effects";
import {
	GET_DAL_CNT,
	GET_INDEX_DATA,
	GET_PRICE_LIST, GET_RECEIPT, SET_RECEIPT,
	SET_STORE_INFO,
	SET_STORE_TAB_INFO
} from "../../actions/payStore";
import {
	ModeTabType,
	ModeType,
	PayStoreStateType,
	PayTypeKor,
	ReceiptType,
} from "../../types/pay/storeType";
import {Action} from "history";
import Api from "../../../context/api";
import Utility from "../../../components/lib/utility";
function* updateIndexData(param) {
	try {
		const res = yield call(Api.getStoreIndexData);
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
			// 스토어 페이지 접근 했을때 탭 초기화
			m.selected = payload === 'POP' && before ? m.modeTab === before.modeTab :
				res.data.mode === ModeType.all ?
					m.modeTab === ModeTabType.inApp : m.modeTab === res.data.mode;

			return m;
		});
		const initPriceListRes = yield call(Api.getDalPriceList, {platform:copy.find(f=>f.selected)?.modeTab});
		yield put({type: SET_STORE_INFO, payload: {dalPriceList: initPriceListRes.data.dalPriceList}});

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
		const res = yield call(Api.getDalPriceList, {platform:param.payload});
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
		const res = yield call(Api.getDalCnt);
		yield put({type: SET_STORE_INFO, payload: {dalCnt: res.data.dalCnt}});
	} catch (e) {
		console.error(`updateDalCnt saga e=>`, e)
	}
}
function* getReceipt(param) {
	try {
		// console.log(param)
		const res = yield call(Api.pay_receipt, {data:param.payload});
		if(!res.data){
			console.error(`updateReceipt pay_receipt params =>`, param.payload, ', result =>',res.data)
		}
		const receipt: ReceiptType = {
			visible: true,
			orderId: res.data.order_id,
			payWay: PayTypeKor[res.data.pay_way],
			payAmt: Utility.addComma(res.data.pay_amt).split('.')[0] + "원 (부가세포함)",
			itemAmt: res.data.item_amt,
			payCode: res.data.pay_code
		}
		yield put({type: SET_RECEIPT, payload: receipt});
	} catch (e) {
		console.error(`updateReceipt saga e=>`, e)
	}
}

function* PayStoreSagas() {
	yield takeLatest(GET_INDEX_DATA, updateIndexData)
	yield takeLatest(GET_PRICE_LIST, updatePriceList)
	yield takeLatest(GET_DAL_CNT, updateDalCnt)
	yield takeLatest(GET_RECEIPT, getReceipt)
}

const payStore = [
	PayStoreSagas()
]

export default payStore
