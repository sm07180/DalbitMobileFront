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

  /* 공통 팝업 */
  commonPopup: false,

  /* 애니메이션 액션 팝업 */
  slidePopup: false,
}

const popup = createReducer<ICommonPopupState, CommonActions>(initialState, {
  "common/SET_COMMON_POPUP_OPEN_DATA": (state, {payload}) => {
    return {...payload, slidePopup: true}
  },
  "common/SET_COMMON_POPUP_CLOSE": () => {
    return {...initialState}
  },
  "common/SET_SLIDE_POPUP_CLOSE": (state) => {
    return {...state, slidePopup: false}
  },
  "common/SET_SLIDE_POPUP_OPEN": (state) => {
    return {...state, slidePopup: true, commonPopup: true}
  }
});

export default popup;
