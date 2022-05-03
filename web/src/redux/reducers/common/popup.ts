import { createReducer } from "typesafe-actions";
import {ICommonPopupState, CommonActions} from "../../types/commonType";

const initialState: ICommonPopupState = {
  /* 프로필 */
  headerPopup: false, // 헤더 더보기
  fanStarPopup: false, // 팬/스타
  likePopup: false, // 좋아요
  blockReportPopup: false, // 차단/신고
  presentPopup: false, // 선물하기
  questionMarkPopup: false, // 물음표 버튼
  historyPopup: false, //
  levelPopup: false, //

  // 달라져스 이벤트
  morePopup: false,
  confirmPopup: false,
  resultPopup: false,

  /* 공통 팝업 */
  commonPopup: false,
  
  /* 레이어 팝업 */
  layerPopup: false,

  /* 애니메이션 액션 팝업 */
  slidePopup: false,
  slideAction: true,
}

const popup = createReducer<ICommonPopupState, CommonActions>(initialState, {
  "common/SET_COMMON_POPUP_OPEN_DATA": (state, {payload}) => {
    return {...payload, commonPopup: true, layerPopup: true}
  },
  "common/SET_COMMON_POPUP_CLOSE": () => {
    return {...initialState}
  },
  "common/SET_LAYER_POPUP_CLOSE": (state) => {
    return {...state, layerPopup: false}
  },
  "common/SET_SLIDE_POPUP_OPEN": (state, {payload}) => {
    return {...state, ...payload, slidePopup: true, slideAction: true}
  },
  "common/SET_SLIDE_POPUP_CLOSE": (state) => {
    return {...state, slidePopup: false}
  },
  "common/SET_SLIDE_CLOSE" : (state) => {
    return {...state, slideAction: false};
  },
});

export default popup;
