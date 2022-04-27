import {createAction} from "typesafe-actions";
import {tabType} from "../../pages/broadcast/constant";
import {AnyDataType, BooleanDataType, RouletteHistoryType, VideoEffectType} from "../types/broadcastCtxType";
import {userBroadcastSettingType} from "../../common/realtime/chat_socket";
import {GlobalCtxStateType, MessageType, MultiViewerType} from "../types/globalCtxType";
  // dispatch(setGlobalCtxMessage({type:"alert",
// ctx_state
export const SET_NATIVE_PLAYER 					= 'global/ctx/SET_NATIVE_PLAYER';
export const SET_MESSAGE 					      = 'global/ctx/SET_MESSAGE';
export const SET_ROOM_INFO 				    	= 'global/ctx/SET_ROOM_INFO';
export const UPDATE_PROFILE 					  = 'global/ctx/UPDATE_PROFILE';
export const SET_CUSTOM_HEADER 					= 'global/ctx/SET_CUSTOM_HEADER';
export const UPDATE_TOKEN 						  = 'global/ctx/UPDATE_TOKEN';
export const SET_MY_INFO 					      = 'global/ctx/SET_MY_INFO';
export const UPDATE_POPUP					      = 'global/ctx/UPDATE_POPUP';
export const SET_VISIBLE 					      = 'global/ctx/SET_VISIBLE';
export const SET_GNB_VISIBLE 					  = 'global/ctx/SET_GNB_VISIBLE';
export const SET_GNB_STATE 					    = 'global/ctx/SET_GNB_STATE';
export const UPDATE_LOGIN					      = 'global/ctx/UPDATE_LOGIN';
export const SET_MEDIA_PLAYER_STATUS 		= 'global/ctx/SET_MEDIA_PLAYER_STATUS';
export const SET_CAST_STATE 					  = 'global/ctx/SET_CAST_STATE';
export const SET_SEARCH 					      = 'global/ctx/SET_SEARCH';
export const SET_LOGO_CHANGE 					  = 'global/ctx/SET_LOGO_CHANGE';
export const SET_PLAYER 					      = 'global/ctx/SET_PLAYER';
export const SET_MY_PAGE_REPORT 				= 'global/ctx/SET_MY_PAGE_REPORT';
export const SET_USER_REPORT 					  = 'global/ctx/SET_USER_REPORT';
export const SET_MY_PAGE_FAN_CNT 				= 'global/ctx/SET_MY_PAGE_FAN_CNT';
export const SET_CLOSE 						      = 'global/ctx/SET_CLOSE';
export const SET_CLOSE_FAN_CNT 					= 'global/ctx/SET_CLOSE_FAN_CNT';
export const SET_CLOSE_STAR_CNT 				= 'global/ctx/SET_CLOSE_STAR_CNT';
export const SET_CLOSE_GOOD_CNT 				= 'global/ctx/SET_CLOSE_GOOD_CNT';
export const SET_CLOSE_PRESENT 					= 'global/ctx/SET_CLOSE_PRESENT';
export const SET_CLOSE_SPECIAL 					= 'global/ctx/SET_CLOSE_SPECIAL';
export const SET_CLOSE_RANK 					  = 'global/ctx/SET_CLOSE_RANK';
export const SET_CLOSE_FAN_RANK 				= 'global/ctx/SET_CLOSE_FAN_RANK';
export const SET_BOARD_NUMBER 					= 'global/ctx/SET_BOARD_NUMBER';
export const SET_NOTICE_INDEX_NUM 			= 'global/ctx/SET_NOTICE_INDEX_NUM';
export const SET_BANNER_CHECK 					= 'global/ctx/SET_BANNER_CHECK';
export const SET_EXIT_MARBLE_INFO 			= 'global/ctx/SET_EXIT_MARBLE_INFO';
export const SET_GLOBAL_GGANBU_STATE 		= 'global/ctx/SET_GLOBAL_GGANBU_STATE';
export const SET_NEWS 						      = 'global/ctx/SET_NEWS';
export const SET_STICKER 					      = 'global/ctx/SET_STICKER';
export const SET_STICKER_MSG 					  = 'global/ctx/SET_STICKER_MSG';
export const SET_FAN_BOARD_BIG_IDX 			= 'global/ctx/SET_FAN_BOARD_BIG_IDX';
export const SET_TOGGLE_STATE 					= 'global/ctx/SET_TOGGLE_STATE';
export const SET_REPLY_IDX 					    = 'global/ctx/SET_REPLY_IDX';
export const SET_NOTICE_STATE 					= 'global/ctx/SET_NOTICE_STATE';
export const SET_REPORT_DATE 					  = 'global/ctx/SET_REPORT_DATE';
export const SET_EDIT_IMAGE 					  = 'global/ctx/SET_EDIT_IMAGE';
export const SET_TEMP_IMAGE 					  = 'global/ctx/SET_TEMP_IMAGE';
export const SET_WALLET_IDX 					  = 'global/ctx/SET_WALLET_IDX';
export const SET_NATIVE_TID 					  = 'global/ctx/SET_NATIVE_TID';
export const SET_FAN_TAB 					      = 'global/ctx/SET_FAN_TAB';
export const SET_FAN_EDIT 					    = 'global/ctx/SET_FAN_EDIT';
export const SET_FAN_EDIT_LENGTH 				= 'global/ctx/SET_FAN_EDIT_LENGTH';
export const SET_SELECT_FAN_TAB 				= 'global/ctx/SET_SELECT_FAN_TAB';
export const SET_EDIT_TOGGLE 					  = 'global/ctx/SET_EDIT_TOGGLE';
export const SET_CTX_DELETE_LIST 				= 'global/ctx/SET_CTX_DELETE_LIST';
export const SET_ATTEND_STAMP 					= 'global/ctx/SET_ATTEND_STAMP';
export const SET_ADMIN_CHECKER 					= 'global/ctx/SET_ADMIN_CHECKER';
export const SET_MY_PAGE_INFO 					= 'global/ctx/SET_MY_PAGE_INFO';
export const SET_FAN_BOARD_REPLY 				= 'global/ctx/SET_FAN_BOARD_REPLY';
export const SET_FAN_BOARD_REPLY_NUM 		= 'global/ctx/SET_FAN_BOARD_REPLY_NUM';
export const SET_CLIP_MAIN_SORT 				= 'global/ctx/SET_CLIP_MAIN_SORT';
export const SET_CLIP_MAIN_DATE 				= 'global/ctx/SET_CLIP_MAIN_DATE';
export const SET_CLIP_REFRESH 					= 'global/ctx/SET_CLIP_REFRESH';
export const SET_CLIP_TAB 					    = 'global/ctx/SET_CLIP_TAB';
export const SET_CLIP_TYPE 					    = 'global/ctx/SET_CLIP_TYPE';
export const SET_URL_STR 					      = 'global/ctx/SET_URL_STR';
export const SET_BOARD_IDX 					    = 'global/ctx/SET_BOARD_IDX';
export const SET_BOARD_MODIFY_INFO 			= 'global/ctx/SET_BOARD_MODIFY_INFO';
export const SET_CLIP_STATE 					  = 'global/ctx/SET_CLIP_STATE';
export const SET_CLIP_PLAYER_STATE 			= 'global/ctx/SET_CLIP_PLAYER_STATE';
export const SET_CLIP_PLAYER_INFO 			= 'global/ctx/SET_CLIP_PLAYER_INFO';
export const SET_ROOM_TYPE 					    = 'global/ctx/SET_ROOM_TYPE';
export const SET_BACK_STATE 					  = 'global/ctx/SET_BACK_STATE';
export const SET_BACK_FUNCTION 					= 'global/ctx/SET_BACK_FUNCTION';
export const SET_SELF_AUTH 					    = 'global/ctx/SET_SELF_AUTH';
export const SET_SPLASH 					      = 'global/ctx/SET_SPLASH';
export const SET_IS_MAILBOX_NEW 				= 'global/ctx/SET_IS_MAILBOX_NEW';
export const SET_USE_MAILBOX 					  = 'global/ctx/SET_USE_MAILBOX';
export const SET_IS_MAILBOX_ON 					= 'global/ctx/SET_IS_MAILBOX_ON';
export const SET_DATE_STATE 					  = 'global/ctx/SET_DATE_STATE';
export const UPDATE_MULTI_VIEWER  			= 'global/ctx/UPDATE_MULTI_VIEWER';
export const SET_BEST_DJ_DATA 					= 'global/ctx/SET_BEST_DJ_DATA';
export const SET_GGANBU_TAB 					  = 'global/ctx/SET_GGANBU_TAB';
export const SET_GO_TO_MOON_TAB 				= 'global/ctx/SET_GO_TO_MOON_TAB';
export const SET_AUTH_REF 					    = 'global/ctx/SET_AUTH_REF';
export const SET_NO_SERVICE_INFO 				= 'global/ctx/SET_NO_SERVICE_INFO';
export const SET_APP_INFO 					    = 'global/ctx/SET_APP_INFO';
export const SET_INTERVAL_ID 				    = 'global/ctx/SET_INTERVAL_ID';
export const SET_BASE_DATA 					    = 'global/ctx/SET_BASE_DATA';
export const SET_ALERT_STATUS 					= 'global/ctx/SET_ALERT_STATUS';
export const SET_LAYER_POP_STATUS 			= 'global/ctx/SET_LAYER_POP_STATUS';
export const SET_MOVE_TO_ALERT 					= 'global/ctx/SET_MOVE_TO_ALERT';
export const SET_TOAST_STATUS 			    = 'global/ctx/SET_TOAST_STATUS';
export const SET_TOOLTIP_STATUS 				= 'global/ctx/SET_TOOLTIP_STATUS';
export const SET_USER_PROFILE 					= 'global/ctx/SET_USER_PROFILE';
export const SET_BROAD_CLIP_DIM 				= 'global/ctx/SET_BROAD_CLIP_DIM';
export const SET_CHECK_DEV 					    = 'global/ctx/SET_CHECK_DEV';
export const SET_CHECK_ADMIN 					  = 'global/ctx/SET_CHECK_ADMIN';
export const SET_SHADOW_ADMIN 					= 'global/ctx/SET_SHADOW_ADMIN';
export const SET_IMG_VIEWER_PATH 				= 'global/ctx/SET_IMG_VIEWER_PATH';
export const SET_IS_SHOW_PLAYER 				= 'global/ctx/SET_IS_SHOW_PLAYER';
export const SET_CLIP_PLAY_MODE 				= 'global/ctx/SET_CLIP_PLAY_MODE';
export const SET_URL_INFO 					    = 'global/ctx/SET_URL_INFO';
export const SET_BROADCAST_ADMIN_LAYER 	= 'global/ctx/SET_BROADCAST_ADMIN_LAYER';
export const SET_IN_BROADCAST 					= 'global/ctx/SET_IN_BROADCAST';
export const SET_ALARM_STATUS 					= 'global/ctx/SET_ALARM_STATUS';
export const SET_ALARM_MOVE_URL 				= 'global/ctx/SET_ALARM_MOVE_URL';
export const SET_REALTIME_BROAD_STATUS 	= 'global/ctx/SET_REALTIME_BROAD_STATUS';
export const SET_MAIL_BLOCK_USER 				= 'global/ctx/SET_MAIL_BLOCK_USER';
export const SET_AGE_DATA 					    = 'global/ctx/SET_AGE_DATA';
export const SET_AUTH_FORM_REF 					= 'global/ctx/SET_AUTH_FORM_REF';
export const SET_USER_REPORT_INFO 			= 'global/ctx/SET_USER_REPORT_INFO';
export const SET_BACK_EVENT_CALLBACK 		= 'global/ctx/SET_BACK_EVENT_CALLBACK';

// ctx_reducer
export const LAYER_STATUS_OPEN_RIGHT_SIDE_USER 			= 'global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_USER';
export const LAYER_STATUS_OPEN_RIGHT_SIDE_NAV 			= 'global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_NAV';
export const LAYER_STATUS_OPEN_RIGHT_SIDE_ALARM 		= 'global/ctx/LAYER_STATUS_OPEN_RIGHT_SIDE_ALARM';
export const LAYER_STATUS_CLOSE_RIGHT_SIDE 			    = 'global/ctx/LAYER_STATUS_CLOSE_RIGHT_SIDE';
export const LAYER_STATUS_OPEN_SEARCH_SIDE 			    = 'global/ctx/LAYER_STATUS_OPEN_SEARCH_SIDE';
export const LAYER_STATUS_CLOSE_SEARCH_SIDE 			  = 'global/ctx/LAYER_STATUS_CLOSE_SEARCH_SIDE';
export const LAYER_STATUS_CLOSE_ALL_SIDE 			      = 'global/ctx/LAYER_STATUS_CLOSE_ALL_SIDE';
export const RTC_INFO_INIT 					                = 'global/ctx/RTC_INFO_INIT';
export const RTC_INFO_EMPTY 				                = 'global/ctx/RTC_INFO_EMPTY';
export const CHAT_INFO_INIT 				                = 'global/ctx/CHAT_INFO_INIT';
export const MAIL_CHAT_INFO_INIT 		                = 'global/ctx/MAIL_CHAT_INFO_INIT';
export const GUEST_INFO_INIT 				                = 'global/ctx/GUEST_INFO_INIT';
export const GUEST_INFO_ADD 				                = 'global/ctx/GUEST_INFO_ADD';
export const GUEST_INFO_REMOVE 			                = 'global/ctx/GUEST_INFO_REMOVE';
export const GUEST_INFO_EMPTY 			                = 'global/ctx/GUEST_INFO_EMPTY';
export const CURRENT_CHAT_DATA_ADD 	                = 'global/ctx/CURRENT_CHAT_DATA_ADD';
export const CURRENT_CHAT_DATA_EMPTY 		        		= 'global/ctx/CURRENT_CHAT_DATA_EMPTY';
export const CLIP_PLAYER_INIT 					            = 'global/ctx/CLIP_PLAYER_INIT';
export const CLIP_PLAYER_EMPTY 					            = 'global/ctx/CLIP_PLAYER_EMPTY';
export const CLIP_INFO_ADD 					                = 'global/ctx/CLIP_INFO_ADD';
export const CLIP_INFO_EMPTY 				            	  = 'global/ctx/CLIP_INFO_EMPTY';
export const CLIP_PLAY_LIST_INIT 		          		  = 'global/ctx/CLIP_PLAY_LIST_INIT';
export const CLIP_PLAY_LIST_ADD   	          			= 'global/ctx/CLIP_PLAY_LIST_ADD';
export const CLIP_PLAY_LIST_EMPTY 	          			= 'global/ctx/CLIP_PLAY_LIST_EMPTY';
export const CLIP_PLAY_LIST_TAB_INIT  				      = 'global/ctx/CLIP_PLAY_LIST_TAB_INIT';
export const CLIP_PLAY_LIST_TAB_ADD   				      = 'global/ctx/CLIP_PLAY_LIST_TAB_ADD';
export const CLIP_PLAY_LIST_TAB_EMPTY 				      = 'global/ctx/CLIP_PLAY_LIST_TAB_EMPTY';

export const WALLET_INIT_DATA 				              = 'global/ctx/WALLET_INIT_DATA';
export const WALLET_ADD_DATA 				                = 'global/ctx/WALLET_ADD_DATA';
export const WALLET_ADD_HISTORY 				            = 'global/ctx/WALLET_ADD_HISTORY';


export const setGlobalCtxNativePlayer = createAction(SET_NATIVE_PLAYER)<any>();
export const setGlobalCtxMessage = createAction(SET_MESSAGE)<MessageType>();
export const setGlobalCtxRoomInfo = createAction(SET_ROOM_INFO)<any>();
export const setGlobalCtxUpdateProfile = createAction(UPDATE_PROFILE)<any>();
export const setGlobalCtxCustomHeader = createAction(SET_CUSTOM_HEADER)<any>();
export const setGlobalCtxUpdateToken = createAction(UPDATE_TOKEN)<any>();
export const setGlobalCtxMyInfo = createAction(SET_MY_INFO)<any>();
export const setGlobalCtxUpdatePopup = createAction(UPDATE_POPUP)<Pick<GlobalCtxStateType, 'popup'>>();
export const setGlobalCtxVisible = createAction(SET_VISIBLE)<any>();
export const setGlobalCtxGnbVisible = createAction(SET_GNB_VISIBLE)<boolean>();
export const setGlobalCtxGnbState = createAction(SET_GNB_STATE)<any>();
export const setGlobalCtxUpdateLogin = createAction(UPDATE_LOGIN)<boolean>();
export const setGlobalCtxMediaPlayerStatus = createAction(SET_MEDIA_PLAYER_STATUS)<boolean>();
export const setGlobalCtxCastState = createAction(SET_CAST_STATE)<any>();
export const setGlobalCtxSearch = createAction(SET_SEARCH)<any>();
export const setGlobalCtxLogoChange = createAction(SET_LOGO_CHANGE)<any>();
export const setGlobalCtxPlayer = createAction(SET_PLAYER)<boolean>();
export const setGlobalCtxMyPageReport = createAction(SET_MY_PAGE_REPORT)<any>();
export const setGlobalCtxUserReport = createAction(SET_USER_REPORT)<any>();
export const setGlobalCtxMyPageFanCnt = createAction(SET_MY_PAGE_FAN_CNT)<any>();
export const setGlobalCtxClose = createAction(SET_CLOSE)<any>();
export const setGlobalCtxCloseFanCnt = createAction(SET_CLOSE_FAN_CNT)<any>();
export const setGlobalCtxCloseStarCnt = createAction(SET_CLOSE_STAR_CNT)<any>();
export const setGlobalCtxCloseGoodCnt = createAction(SET_CLOSE_GOOD_CNT)<any>();
export const setGlobalCtxClosePresent = createAction(SET_CLOSE_PRESENT)<any>();
export const setGlobalCtxCloseSpecial = createAction(SET_CLOSE_SPECIAL)<any>();
export const setGlobalCtxCloseRank = createAction(SET_CLOSE_RANK)<any>();
export const setGlobalCtxCloseFanRank = createAction(SET_CLOSE_FAN_RANK)<any>();
export const setGlobalCtxBoardNumber = createAction(SET_BOARD_NUMBER)<any>();
export const setGlobalCtxNoticeIndexNum = createAction(SET_NOTICE_INDEX_NUM)<any>();
export const setGlobalCtxBannerCheck = createAction(SET_BANNER_CHECK)<any>();
export const setGlobalCtxExitMarbleInfo = createAction(SET_EXIT_MARBLE_INFO)<any>();
export const setGlobalCtxGlobalGganbuState = createAction(SET_GLOBAL_GGANBU_STATE)<any>();
export const setGlobalCtxNews = createAction(SET_NEWS)<any>();
export const setGlobalCtxSticker = createAction(SET_STICKER)<any>();
export const setGlobalCtxStickerMsg = createAction(SET_STICKER_MSG)<any>();
export const setGlobalCtxFanBoardBigIdx = createAction(SET_FAN_BOARD_BIG_IDX)<any>();
export const setGlobalCtxToggleState = createAction(SET_TOGGLE_STATE)<any>();
export const setGlobalCtxReplyIdx = createAction(SET_REPLY_IDX)<any>();
export const setGlobalCtxNoticeState = createAction(SET_NOTICE_STATE)<any>();
export const setGlobalCtxReportDate = createAction(SET_REPORT_DATE)<any>();
export const setGlobalCtxEditImage = createAction(SET_EDIT_IMAGE)<any>();
export const setGlobalCtxTempImage = createAction(SET_TEMP_IMAGE)<any>();
export const setGlobalCtxWalletIdx = createAction(SET_WALLET_IDX)<any>();
export const setGlobalCtxNativeTid = createAction(SET_NATIVE_TID)<any>();
export const setGlobalCtxFanTab = createAction(SET_FAN_TAB)<any>();
export const setGlobalCtxFanEdit = createAction(SET_FAN_EDIT)<any>();
export const setGlobalCtxFanEditLength = createAction(SET_FAN_EDIT_LENGTH)<any>();
export const setGlobalCtxSelectFanTab = createAction(SET_SELECT_FAN_TAB)<any>();
export const setGlobalCtxEditToggle = createAction(SET_EDIT_TOGGLE)<any>();
export const setGlobalCtxDeleteList = createAction(SET_CTX_DELETE_LIST)<any>();
export const setGlobalCtxAttendStamp = createAction(SET_ATTEND_STAMP)<any>();
export const setGlobalCtxAdminChecker = createAction(SET_ADMIN_CHECKER)<any>();
export const setGlobalCtxMyPageInfo = createAction(SET_MY_PAGE_INFO)<any>();
export const setGlobalCtxFanBoardReply = createAction(SET_FAN_BOARD_REPLY)<any>();
export const setGlobalCtxFanBoardReplyNum = createAction(SET_FAN_BOARD_REPLY_NUM)<any>();
export const setGlobalCtxClipMainSort = createAction(SET_CLIP_MAIN_SORT)<any>();
export const setGlobalCtxClipMainDate = createAction(SET_CLIP_MAIN_DATE)<any>();
export const setGlobalCtxClipRefresh = createAction(SET_CLIP_REFRESH)<any>();
export const setGlobalCtxClipTab = createAction(SET_CLIP_TAB)<any>();
export const setGlobalCtxClipType = createAction(SET_CLIP_TYPE)<any>();
export const setGlobalCtxUrlStr = createAction(SET_URL_STR)<any>();
export const setGlobalCtxBoardIdx = createAction(SET_BOARD_IDX)<any>();
export const setGlobalCtxBoardModifyInfo = createAction(SET_BOARD_MODIFY_INFO)<any>();
export const setGlobalCtxClipState = createAction(SET_CLIP_STATE)<any>();
export const setGlobalCtxClipPlayerState = createAction(SET_CLIP_PLAYER_STATE)<any>();
export const setGlobalCtxClipPlayerInfo = createAction(SET_CLIP_PLAYER_INFO)<any>();
export const setGlobalCtxRoomType = createAction(SET_ROOM_TYPE)<any>();
export const setGlobalCtxBackState = createAction(SET_BACK_STATE)<any>();
export const setGlobalCtxBackFunction = createAction(SET_BACK_FUNCTION)<any>();
export const setGlobalCtxSelfAuth = createAction(SET_SELF_AUTH)<any>();
export const setGlobalCtxSplash = createAction(SET_SPLASH)<any>();
export const setGlobalCtxIsMailboxNew = createAction(SET_IS_MAILBOX_NEW)<any>();
export const setGlobalCtxUseMailbox = createAction(SET_USE_MAILBOX)<any>();
export const setGlobalCtxIsMailboxOn = createAction(SET_IS_MAILBOX_ON)<any>();
export const setGlobalCtxDateState = createAction(SET_DATE_STATE)<any>();
export const setGlobalCtxMultiViewer = createAction(UPDATE_MULTI_VIEWER)<MultiViewerType>();
export const setGlobalCtxBestDjData = createAction(SET_BEST_DJ_DATA)<any>();
export const setGlobalCtxGganbuTab = createAction(SET_GGANBU_TAB)<any>();
export const setGlobalCtxGoToMoonTab = createAction(SET_GO_TO_MOON_TAB)<any>();
export const setGlobalCtxAuthRef = createAction(SET_AUTH_REF)<any>();
export const setGlobalCtxNoServiceInfo = createAction(SET_NO_SERVICE_INFO)<any>();
export const setGlobalCtxAppInfo = createAction(SET_APP_INFO)<any>();
export const setGlobalCtxIntervalId = createAction(SET_INTERVAL_ID)<any>();
export const setGlobalCtxBaseData = createAction(SET_BASE_DATA)<any>();
export const setGlobalCtxAlertStatus = createAction(SET_ALERT_STATUS)<any>();
export const setGlobalCtxLayerPopStatus = createAction(SET_LAYER_POP_STATUS)<any>();
export const setGlobalCtxMoveToAlert = createAction(SET_MOVE_TO_ALERT)<any>();
export const setGlobalCtxSetToastStatus = createAction(SET_TOAST_STATUS)<any>();
export const setGlobalCtxTooltipStatus = createAction(SET_TOOLTIP_STATUS)<any>();
export const setGlobalCtxUserProfile = createAction(SET_USER_PROFILE)<any>();
export const setGlobalCtxBroadClipDim = createAction(SET_BROAD_CLIP_DIM)<boolean>();
export const setGlobalCtxCheckDev = createAction(SET_CHECK_DEV)<any>();
export const setGlobalCtxCheckAdmin = createAction(SET_CHECK_ADMIN)<any>();
export const setGlobalCtxShadowAdmin = createAction(SET_SHADOW_ADMIN)<any>();
export const setGlobalCtxImgViewerPath = createAction(SET_IMG_VIEWER_PATH)<any>();
export const setGlobalCtxIsShowPlayer = createAction(SET_IS_SHOW_PLAYER)<boolean>();
export const setGlobalCtxClipPlayMode = createAction(SET_CLIP_PLAY_MODE)<Pick<GlobalCtxStateType, 'clipPlayMode'>>();
// export const setGlobalCtxClipPlayMode = createAction(SET_CLIP_PLAY_MODE)<"" | "normal" | "allLoop" | "oneLoop" | "shuffle">();
export const setGlobalCtxUrlInfo = createAction(SET_URL_INFO)<any>();
export const setGlobalCtxBroadcastAdminLayer = createAction(SET_BROADCAST_ADMIN_LAYER)<any>();
export const setGlobalCtxInBroadcast = createAction(SET_IN_BROADCAST)<boolean>();
export const setGlobalCtxAlarmStatus = createAction(SET_ALARM_STATUS)<any>();
export const setGlobalCtxAlarmMoveUrl = createAction(SET_ALARM_MOVE_URL)<any>();
export const setGlobalCtxRealtimeBroadStatus = createAction(SET_REALTIME_BROAD_STATUS)<any>();
export const setGlobalCtxMailBlockUser = createAction(SET_MAIL_BLOCK_USER)<any>();
export const setGlobalCtxAgeData = createAction(SET_AGE_DATA)<any>();
export const setGlobalCtxAuthFormRef = createAction(SET_AUTH_FORM_REF)<any>();
export const setGlobalCtxUserReportInfo = createAction(SET_USER_REPORT_INFO)<any>();
export const setGlobalCtxBackEventCallback = createAction(SET_BACK_EVENT_CALLBACK)<any>();

export const setGlobalCtxLayerStatusOpenRightSideUser = createAction(LAYER_STATUS_OPEN_RIGHT_SIDE_USER)();
export const setGlobalCtxLayerStatusOpenRightSideNav = createAction(LAYER_STATUS_OPEN_RIGHT_SIDE_NAV)();
export const setGlobalCtxLayerStatusOpenRightSideAlarm = createAction(LAYER_STATUS_OPEN_RIGHT_SIDE_ALARM)();
export const setGlobalCtxLayerStatusCloseRightSide = createAction(LAYER_STATUS_CLOSE_RIGHT_SIDE)();
export const setGlobalCtxLayerStatusOpenSearchSide = createAction(LAYER_STATUS_OPEN_SEARCH_SIDE)();
export const setGlobalCtxLayerStatusCloseSearchSide = createAction(LAYER_STATUS_CLOSE_SEARCH_SIDE)();
export const setGlobalCtxLayerStatusCloseAllSide = createAction(LAYER_STATUS_CLOSE_ALL_SIDE)();
export const setGlobalCtxRtcInfoInit = createAction(RTC_INFO_INIT)<any>();
export const setGlobalCtxRtcInfoEmpty = createAction(RTC_INFO_EMPTY)();
export const setGlobalCtxChatInfoInit = createAction(CHAT_INFO_INIT)<any>();
export const setGlobalCtxMailChatInfoInit = createAction(MAIL_CHAT_INFO_INIT)<any>();
export const setGlobalCtxGuestInfoInit = createAction(GUEST_INFO_INIT)<any>();
export const setGlobalCtxGuestInfoAdd = createAction(GUEST_INFO_ADD)<any>();
export const setGlobalCtxGuestInfoRemove = createAction(GUEST_INFO_REMOVE)<any>();
export const setGlobalCtxGuestInfoEmpty = createAction(GUEST_INFO_EMPTY)();
export const setGlobalCtxCurrentChatDataAdd = createAction(CURRENT_CHAT_DATA_ADD)<any>();
export const setGlobalCtxCurrentChatDataEmpty = createAction(CURRENT_CHAT_DATA_EMPTY)();
export const setGlobalCtxClipPlayerInit = createAction(CLIP_PLAYER_INIT)<any>();
export const setGlobalCtxClipPlayerEmpty = createAction(CLIP_PLAYER_EMPTY)();
export const setGlobalCtxClipInfoAdd = createAction(CLIP_INFO_ADD)<any>();
export const setGlobalCtxClipInfoEmpty = createAction(CLIP_INFO_EMPTY)();
export const setGlobalCtxClipPlayListInit = createAction(CLIP_PLAY_LIST_INIT)();
export const setGlobalCtxClipPlayListAdd = createAction(CLIP_PLAY_LIST_ADD)<any>();
export const setGlobalCtxClipPlayListEmpty = createAction(CLIP_PLAY_LIST_EMPTY)();
export const setGlobalCtxClipPlayListTabInit = createAction(CLIP_PLAY_LIST_TAB_INIT)();
export const setGlobalCtxClipPlayListTabAdd = createAction(CLIP_PLAY_LIST_TAB_ADD)<any>();
export const setGlobalCtxClipPlayListTabEmpty = createAction(CLIP_PLAY_LIST_TAB_EMPTY)();

export const setGlobalCtxWalletInitData = createAction(WALLET_INIT_DATA)();
export const setGlobalCtxWalletAddData = createAction(WALLET_ADD_DATA)<any>();
export const setGlobalCtxWalletAddHistory = createAction(WALLET_ADD_HISTORY)<any>();
