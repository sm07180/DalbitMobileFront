import { createAction } from "typesafe-actions";
import {ICommonPopupState} from "../types/commonType";

export const SET_IS_LOADING = 'common/SET_IS_LOADING';
export const SET_IS_LOADING_SUCCESS = 'common/SET_IS_LOADING_SUCCESS';

export const setIsLoading = createAction(SET_IS_LOADING)();
export const setIsLoadingSuccess = createAction(SET_IS_LOADING_SUCCESS)<boolean|{isLoading:boolean,text:string}>();


export const SET_IS_DESKTOP = 'common/SET_IS_DESKTOP';
export const setIsDesktop = createAction(SET_IS_DESKTOP)<boolean>();

export const SET_IS_REFRESH = 'common/SET_IS_REFRESH';
export const setIsRefresh = createAction(SET_IS_REFRESH)<boolean>();

// PopSlide.js ------------------------------------------------------------
/* 띄울 팝업 호출 */
const SET_COMMON_POPUP_OPEN_DATA = 'common/SET_COMMON_POPUP_OPEN_DATA';
export const setCommonPopupOpenData = createAction(SET_COMMON_POPUP_OPEN_DATA)<ICommonPopupState>();

/* 띄운 팝업 닫기 */
const SET_COMMON_POPUP_CLOSE = 'common/SET_COMMON_POPUP_CLOSE';
export const setCommonPopupClose = createAction(SET_COMMON_POPUP_CLOSE)<void>();

/* 레이어 팝업 닫기 */
const SET_LAYER_POPUP_CLOSE = 'common/SET_LAYER_POPUP_CLOSE';
export const setLayerPopupClose = createAction(SET_LAYER_POPUP_CLOSE)<ICommonPopupState>();

/* 슬라이드 팝업 닫기 */
const SET_SLIDE_POPUP_CLOSE = 'common/SET_SLIDE_POPUP_CLOSE';
export const setSlidePopupClose = createAction(SET_SLIDE_POPUP_CLOSE)<void>();

/* 공통(이름) 슬라이드 팝업 열기 */
const SET_SLIDE_POPUP_OPEN = 'common/SET_SLIDE_POPUP_OPEN';
export const setSlidePopupOpen = createAction(SET_SLIDE_POPUP_OPEN)<void|ICommonPopupState>();

// -----------------------------------------------------------------------

/* 슬라이드 팝업 애니메이션 닫기 */
const SET_SLIDE_CLOSE = 'common/SET_SLIDE_CLOSE';
export const setSlideClose = createAction(SET_SLIDE_CLOSE)<void>();

/* 웹뷰 체크 */
const SET_IS_WEBVIEW = 'common/SET_IS_WEBVIEW';
export const setIsWebView = createAction(SET_IS_WEBVIEW)<string>();
